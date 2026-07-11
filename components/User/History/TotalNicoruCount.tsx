import NicoruSvg from "@/components/PMWatch/modules/CommentList/nicoruSvg"
import { useNicoruReceiveCountData } from "@/hooks/apiHooks/user/nicoruReceiveCountData"

export function TotalNicoruCount() {
    const { nicoruReceiveCountData, error, isLoading } = useNicoruReceiveCountData()
    if (isLoading) {
        return (
            <div className="user-history-nicoru-totalcount">
                ニコられた合計を取得中
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-history-nicoru-totalcount">
                ニコられた合計の取得に失敗しました
            </div>
        )
    }

    return (
        <div className="user-history-nicoru-totalcount">
            ニコられた合計
            {" "}
            <NicoruSvg />
            <strong>
                {nicoruReceiveCountData?.data.count || 0}
            </strong>
        </div>
    )
}
