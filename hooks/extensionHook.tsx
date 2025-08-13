import { useState, useEffect, useContext, createContext, ReactNode, useSyncExternalStore, RefObject } from "react"
import { Unwatch, WatchCallback } from "wxt/utils/storage"

async function getSyncStorageData() {
    return await browser.storage.sync.get(null)
}
async function getLocalStorageData() {
    return await browser.storage.local.get(null)
}

export function useSyncStorage() {
    const [syncStorage, _setSyncStorageVar] = useState({})
    function setSyncStorageValue(name: string, value: any) {
        _setSyncStorageVar((current) => {
            return {
                ...current,
                [name]: value,
            }
        })
        browser.storage.sync.set({ [name]: value })
    }
    useEffect(() => {
        async function setStorage() {
            _setSyncStorageVar(await getSyncStorageData())
        }
        setStorage()
    }, [])
    return [syncStorage, setSyncStorageValue]
}

export function useLocalStorage() {
    const [localStorage, _setLocalStorageVar] = useState({})
    function setLocalStorageValue(name: string, value: any) {
        _setLocalStorageVar((current) => {
            return {
                ...current,
                [name]: value,
            }
        })
        browser.storage.local.set({ [name]: value })
    }
    useEffect(() => {
        async function setStorage() {
            _setLocalStorageVar(await getLocalStorageData())
        }
        setStorage()
    }, [])
    return [localStorage, setLocalStorageValue]
}

export function useManifestData() {
    return browser.runtime.getManifest()
}

export function useStorage() {
    const [storages, _setStorageVar] = useState<{ local: { [key: string]: any }, sync: { [key: string]: any }, isLoaded: boolean }>({ local: {}, sync: {}, isLoaded: false })
    const setLocalStorageValue = useCallback((name: string, value: any, silent = false) => {
        if (!silent) {
            _setStorageVar((current) => {
                return {
                    ...current,
                    local: {
                        ...current.local,
                        [name]: value,
                    },
                }
            })
        }
        browser.storage.local.set({ [name]: value })
    }, [_setStorageVar])
    const setSyncStorageValue = useCallback((name: string, value: any) => {
        _setStorageVar((current) => {
            return {
                ...current,
                sync: {
                    ...current.sync,
                    [name]: value,
                },
            }
        })
        browser.storage.sync.set({ [name]: value })
    }, [_setStorageVar])
    useEffect(() => {
        async function setStorage() {
            const localStorage = await getLocalStorageData()
            const syncStorage = await getSyncStorageData()
            _setStorageVar({ local: localStorage, sync: syncStorage, isLoaded: true })
        }
        setStorage()
    }, [])
    return { storages, setLocalStorageValue, setSyncStorageValue }
}

type StorageVarManager = {
    watch: (key: StorageItemKey, callback: WatchCallback<unknown>) => () => void
    getItems: <K extends readonly StorageItemKey[]>(keys: K) => Promise<{ [P in K[number]]?: any }>
    _cachedStorage: Map<StorageItemKey, any>
}

const IStorageContext = createContext<RefObject<StorageVarManager> | null>(null)

export function StorageProvider({ children }: { children: ReactNode }) {
    const storageVarRef = useRef(storageVar())
    useEffect(() => {
        storage.snapshot("sync").then((snapshot) => {
            const prefixedSnapshot = Object.keys(snapshot).map((key) => {
                return { [`sync:${key}`]: snapshot[key as keyof typeof snapshot] }
            }).reduce((p, c) => Object.assign(p, c), {})
            for (const key in prefixedSnapshot) {
                storageVarRef.current._cachedStorage.set(key as StorageItemKey, prefixedSnapshot[key as keyof typeof prefixedSnapshot])
            }
        })
        storage.snapshot("local").then((snapshot) => {
            const prefixedSnapshot = Object.keys(snapshot).map((key) => {
                return { [`local:${key}`]: snapshot[key as keyof typeof snapshot] }
            }).reduce((p, c) => Object.assign(p, c), {})
            for (const key in prefixedSnapshot) {
                storageVarRef.current._cachedStorage.set(key as StorageItemKey, prefixedSnapshot[key as keyof typeof prefixedSnapshot])
            }
        })
    }, [])
    return (
        <IStorageContext value={storageVarRef}>
            {children}
        </IStorageContext>
    )
}

export function useStorageContext() {
    return useContext(IStorageContext)
}

export function storageVar(): StorageVarManager {
    const watch = new Map<StorageItemKey, Unwatch>()
    const callbacks = new Map<StorageItemKey, Map<string, WatchCallback<unknown>>>()
    const cachedStorage = new Map<StorageItemKey, any>()

    return {
        watch: (key: StorageItemKey, callback: WatchCallback<unknown>) => {
            const subscribeKey = crypto.randomUUID()
            if (callbacks.has(key)) {
                callbacks.get(key)!.set(subscribeKey, callback)
            } else {
                callbacks.set(key, new Map().set(subscribeKey, callback))
            }
            if (!watch.has(key)) {
                watch.set(key, storage.watch(key, (newValue, oldValue) => {
                    callbacks.get(key)!.forEach((callback) => {
                        callback(newValue, oldValue)
                    })
                    cachedStorage.set(key, newValue)
                }))
            }
            return () => {
                if (callbacks.has(key)) {
                    callbacks.get(key)!.delete(subscribeKey)
                }
            }
        },
        getItems: async <K extends readonly StorageItemKey[]>(keys: K): Promise<{ [P in K[number]]?: any }> => {
            const object = {}
            for (const key of keys) {
                if (cachedStorage.get(key) !== undefined) {
                    Object.assign(object, { [key]: cachedStorage.get(key) })
                } else {
                    const currentValue = await storage.getItem(key)
                    Object.assign(object, { [key]: currentValue })
                    cachedStorage.set(key, currentValue)
                }
            }
            return object
        },
        _cachedStorage: cachedStorage,
    }
}

/**
 * 拡張機能ストレージから必要なキーのみを取得するフック
 * @param keys 取得するキーの配列(as const を使うこと)
 * @param type 種別 (デフォルトはsync)
 * @returns 統合されたオブジェクト
 */
export function useStorageVar<K extends readonly string[]>(keys: K, type: "sync" | "local" | "session" | "managed" = "sync"): { [P in K[number]]?: any } {
    const storageManager = useStorageContext()
    const _storageRef = useRef<{ [P in K[number]]: any }>({} as { [P in K[number]]: any })
    const subscribe = useCallback((onUpdate: () => void) => {
        let aborted = false
        // StorageItemKey の形に直して取得
        storageManager?.current.getItems(keys.map(key => `${type}:${key}` as StorageItemKey)).then((object) => {
            if (!aborted) {
                // keyからtypeを取り除く
                _storageRef.current = Object.keys(object).map((key) => {
                    return { [key.replace(`${type}:`, "")]: object[key as keyof typeof object] } as { [P in K[number]]: string }
                }).reduce((p, c) => Object.assign(p, c), {} as { [P in K[number]]: string })
                onUpdate()
            }
        })
        // watch は unwatch の関数を返す
        const unwatchFunctions = keys.map(key => storageManager?.current.watch(`${type}:${key}` as StorageItemKey, (n) => {
            if (!aborted && !Object.is(_storageRef.current[key as keyof typeof _storageRef.current], n)) {
                _storageRef.current = { ..._storageRef.current, [key]: n } as { [P in K[number]]: string }
                onUpdate()
            }
        }))
        return () => {
            aborted = true
            for (const unwatch of unwatchFunctions) {
                if (unwatch) unwatch()
            }
        }
    }, [storageManager])
    const storageObject = useSyncExternalStore(subscribe, () => _storageRef.current)
    return storageObject
}
