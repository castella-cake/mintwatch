export const getSyncStorageData = browser.storage.sync.get(null)

export const getLocalStorageData = browser.storage.local.get(null)

export async function getStorageItemsWithObject<K extends readonly StorageItemKey[]>(keys: K): Promise<{ [P in K[number]]?: any }> {
    const item = await storage.getItems([...keys])
    return { ...item.reduce((prev, current) => (Object.assign(prev, { [current.key]: current.value })), {}) } as { [P in K[number]]: string }
}
