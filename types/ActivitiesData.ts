export interface ActivitiesDataRootObject {
    activities: Activity[]
    code: string
    impressionId: string
    nextCursor: string
}

export interface Activity {
    sensitive: boolean
    message: Message
    thumbnailUrl: string
    label: Message
    content: Content
    id: string
    kind: string
    createdAt: string
    actor: Actor
}

interface Actor {
    id: string
    type: string
    name: string
    iconUrl: string
    url: string
    isLive: boolean
}

interface Content {
    type: string
    id: string
    title: string
    url: string
    startedAt: string
    video?: Video
    program?: Program
}

interface Program {
    statusCode: string
    providerType: string
}

interface Video {
    duration: number
    playbackPosition?: number
}

interface Message {
    text: string
}
