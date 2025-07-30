export interface ActorsDataRootObject {
    actors: Actor[]
    code: string
}

interface Actor {
    id: string
    type: string
    name: string
    iconUrl: string
    url: string
    isLive: boolean
    isUnread: boolean
}
