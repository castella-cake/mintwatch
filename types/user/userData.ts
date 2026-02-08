import { GenericUserData } from "./genericUserData"

export interface UserDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    user: GenericUserData
    relationships: Relationships
}

interface Relationships {
    sessionUser: SessionUser
    isMe: boolean
}

interface SessionUser {
    isFollowing: boolean
}
