import { AccountUserData } from "@/types/user/accountUserData"
import { useAccountUserQuery } from "./apiHooks/global/accountUser"
import useServerContext from "./serverContextHook"

type simpleContext = {
    nickname: string
    id: number
    isPremium: boolean
}

export function useAccountContext() {
    const serverContext = useServerContext()
    const simpleContext = serverContext ? contextToSimpleContext(serverContext) : null
    const { accountUserData } = useAccountUserQuery(!!simpleContext) // simpleContextが存在する場合はaccountUserDataの取得をスキップ
    const fallbackUserContext = accountUserData ? accountUserDataToSimpleContext(accountUserData) : null
    return simpleContext || fallbackUserContext
}

function contextToSimpleContext(contextData: ServerContextRootObject): simpleContext | null {
    if (!contextData.sessionUser) return null
    return {
        nickname: contextData.sessionUser.nickname,
        id: contextData.sessionUser.id,
        isPremium: contextData.sessionUser.type === "premium",
    }
}

function accountUserDataToSimpleContext(accountUserData: AccountUserData): simpleContext {
    return {
        nickname: accountUserData.data.nickname,
        id: Number(accountUserData.data.userId),
        isPremium: accountUserData.data.hasPremiumOrStrongerRights,
    }
}
