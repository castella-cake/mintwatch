export interface NgCommentsRootObject extends baseResponse {
    data: NgData
}

export interface NgData {
    revision: number
    count: number
    items: Item[]
}

interface Item {
    type: "command" | "id" | "word"
    source: string
    registeredAt: string
}
