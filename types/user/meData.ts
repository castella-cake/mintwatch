import { GenericUserData } from "./genericUserData"

export interface MeDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    user: MyUser
}

interface MyUser extends GenericUserData {
    niconicoPoint: number
    language: string
    premiumTicketExpireTime: null
    creatorPatronizingScore: number
    isMailBounced: boolean
    isNicorepoReadable: boolean
    isNicorepoAutoPostedToTwitter: boolean
}
