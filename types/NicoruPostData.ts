export interface NicoruKeyResponseRootObject extends baseResponse {
    data: NicoruKeyResponseData
}

interface NicoruKeyResponseData {
    nicoruKey: string
}

export interface NicoruPostBodyRootObject {
    videoId: string
    fork: string
    no: number
    content: string
    nicoruKey: string
}

export interface NicoruPostResponseRootObject extends baseResponse {
    data: NicoruPostResponseData
}

interface NicoruPostResponseData {
    nicoruCount: number
    nicoruId: string
}

export interface NicoruRemoveRootObject extends baseResponse {
    data: any[]
}
