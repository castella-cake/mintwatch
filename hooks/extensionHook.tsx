import { useState, useEffect, useContext, createContext, ReactNode, useSyncExternalStore } from "react"

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

const IStorageContext = createContext<{
    syncStorage: { [key: string]: any }
    setSyncStorageValue: (name: string, value: any, silent?: boolean) => void
    localStorage: { [key: string]: any }
    setLocalStorageValue: (name: string, value: any, silent?: boolean) => void
    isLoaded: boolean
}>({ syncStorage: {}, setSyncStorageValue: () => {}, localStorage: {}, setLocalStorageValue: () => {}, isLoaded: false })

export function StorageProvider({ children }: { children: ReactNode }) {
    const { storages, setLocalStorageValue, setSyncStorageValue } = useStorage()
    return (
        <IStorageContext value={{ syncStorage: storages.sync, setSyncStorageValue, localStorage: storages.local, setLocalStorageValue, isLoaded: storages.isLoaded }}>
            {children}
        </IStorageContext>
    )
}

export function useStorageContext() {
    return useContext(IStorageContext)
}

/**
 * 拡張機能ストレージから必要なキーのみを取得するフック
 * @param keys 取得するキーの配列(as const を使うこと)
 * @param type 種別 (デフォルトはsync)
 * @returns 統合されたオブジェクト
 */
export function useStorageVar<K extends readonly string[]>(keys: K, type: "sync" | "local" | "session" | "managed" = "sync"): { [P in K[number]]?: any } {
    const _storageRef = useRef<{ [P in K[number]]: any }>({} as { [P in K[number]]: any })
    const subscribe = useCallback((onUpdate: () => void) => {
        let aborted = false
        // StorageItemKey の形に直して取得
        getStorageItemsWithObject(keys.map(key => `${type}:${key}` as StorageItemKey)).then((object) => {
            if (!aborted) {
                _storageRef.current = Object.keys(object).map((key) => {
                    return { [key.replace(`${type}:`, "")]: object[key as keyof typeof object] } as { [P in K[number]]: string }
                }).reduce((p, c) => Object.assign(p, c), {} as { [P in K[number]]: string })
                onUpdate()
            }
        })
        // watch は unwatch の関数を返す
        const unwatchFunctions = keys.map(key => storage.watch(`${type}:${key}` as StorageItemKey, (n) => {
            if (!aborted) {
                _storageRef.current = { ..._storageRef.current, [key]: n } as { [P in K[number]]: string }
                onUpdate()
            }
        }))
        return () => {
            aborted = true
            for (const unwatch of unwatchFunctions) {
                unwatch()
            }
        }
    }, [])
    const storageObject = useSyncExternalStore(subscribe, () => _storageRef.current)
    return storageObject
}
