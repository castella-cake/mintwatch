export default class APIError<T = Record<string, any>> extends Error {
    response: T
    constructor(message: string, response: T) {
        super(`called API returned error: ${JSON.stringify(response)}`)
        this.name = "APIError"
        this.message = message ?? "Unknown API error."
        this.response = response
    }
}
