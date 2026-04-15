import { useSyncExternalStore } from "react"

function subscribeToLocalStorage(callback: () => void) {
    window.addEventListener("pmwInternalStorage", callback)
    return () => window.removeEventListener("pmwInternalStorage", callback)
}

export function useBrowserLocalStorage<T>(key: string) {
    const data = useSyncExternalStore(subscribeToLocalStorage, () => {
        return localStorage.getItem(key)
    })
    const setBrowserLocalStorage = (value: T) => {
        localStorage.setItem(key, JSON.stringify(value))
        window.dispatchEvent(new Event("pmwInternalStorage"))
    }
    return { data, setBrowserLocalStorage }
}
