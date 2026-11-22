import { AchievedHistoryItem } from "../generic/Achievement"

export interface PinnedAchievedHistoryDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    user_achieved_history: AchievedHistoryItem
}
