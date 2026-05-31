export interface GenresDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    genres: Genre[]
}

interface Genre {
    key: string
    label: string
}
