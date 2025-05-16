class APIError extends Error {
    response: {[key: string]: any} = {}
    constructor(message: string, response: {[key: string]: any}) {
        super(`called API returned error: ${response}`)
        this.name = 'APIError'
        this.message = message ?? "Unknown API error."
        this.response = response
    }
}