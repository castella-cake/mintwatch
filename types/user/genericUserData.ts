export interface GenericUserData {
    id: number
    nickname: string
    icons: Icons
    description: string
    decoratedDescriptionHtml: string
    strippedDescription: string
    isPremium: boolean
    registeredVersion: string
    followeeCount: number
    followerCount: number
    userLevel: UserLevel
    userChannel: null
    isNicorepoReadable: boolean
    sns: Sns[]
    coverImage: CoverImage
}

interface CoverImage {
    ogpUrl: string
    pcUrl: string
    smartphoneUrl: string
}

interface Sns {
    type: string
    label: string
    iconUrl: string
    screenName: string
    url: string
}

interface UserLevel {
    currentLevel: number
    nextLevelThresholdExperience: number
    nextLevelExperience: number
    currentLevelExperience: number
}

interface Icons {
    small: string
    large: string
}
