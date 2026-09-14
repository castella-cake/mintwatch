export class SavedSearchLimitExceededError extends Error {
    constructor() {
        super("Maximum number of saved searches is 30.")
        this.name = "SavedSearchLimitExceededError"
    }
}

export class SavedSearchDuplicatedError extends Error {
    entry: localStorageNvpcSearchItem
    constructor(entry: localStorageNvpcSearchItem) {
        super(`The same search already exists in saved searches. \nDuplicated entry: ${JSON.stringify(entry)}`)
        this.name = "SavedSearchDuplicatedError"
        this.entry = entry
    }
}
