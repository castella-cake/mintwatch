export const getSyncStorageData = browser.storage.sync.get(null)

export const getLocalStorageData = browser.storage.local.get(null)

export async function getStorageItemsWithObject<K extends readonly StorageItemKey[]>(keys: K, type: "sync" | "local" | "session" | "managed" = "sync"): Promise<{ [P in K[number]]?: any }> {
    const item = await storage.getItems(keys.map(k => `${type}:${k}` as StorageItemKey))
    return { ...item.reduce((prev, current) => ({ ...prev, [current.key.replace(`${type}:`, "")]: current.value }), {}) } as { [P in K[number]]: string }
}
