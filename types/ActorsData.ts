export interface ActorsDataRootObject extends feedBaseResponse {
    actors: Actor[]
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
