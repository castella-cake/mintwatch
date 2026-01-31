import { PersistedClient, Persister } from "@tanstack/react-query-persist-client"

export function createExtensionStoragePersister() {
    return {
        persistClient: async (client: PersistedClient) => {
            await storage.setItem("local:reactQueryPersistedClient", client)
        },
        restoreClient: async () => {
            const storageItem = await storage.getItem<PersistedClient>("local:reactQueryPersistedClient")
            return storageItem ?? undefined
        },
        removeClient: async () => {
            await storage.removeItem("local:reactQueryPersistedClient")
        },
    } satisfies Persister
}
