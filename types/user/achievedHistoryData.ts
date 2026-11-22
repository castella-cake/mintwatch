import { AchievedHistoryItem } from "../generic/Achievement"

export interface AchievedHistoryDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    user_achieved_histories: AchievedHistoryItem[]
    total_count: number
}
