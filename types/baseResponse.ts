export interface baseResponse {
    meta: Meta
}

interface Meta {
    status: number
    errorCode?: string
    code?: string
    errorMessage?: string
}
