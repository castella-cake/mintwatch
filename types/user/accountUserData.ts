export interface AccountUserData extends baseResponse {
    data: Data
}

interface Data {
    userId: string
    nickname: string
    area: string
    language: string
    locale: string
    timezone: string
    isExplicitlyLoginable: boolean
    description: string
    hasPremiumOrStrongerRights: boolean
    hasSuperPremiumOrStrongerRights: boolean
    premium: Premium
    icons: Icons
    existence: Existence
    contacts: Contacts
}

interface Contacts {
    emails: Emails
}

interface Emails {
    1: _1
}

interface _1 {
    address: string
    is_feature_phone: boolean
    is_confirmed: boolean
}

interface Existence {
    residence: Residence
    birthday: string
    sex: string
}

interface Residence {
    country: string
    prefecture: string
}

interface Icons {
    urls: Urls
}

interface Urls {
    "150x150": string
    "50x50": string
}

interface Premium {
    type: string
}
