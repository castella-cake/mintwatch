import { useLocationContext } from "@/components/Router/RouterContext"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useCommentContentContext, useCommentControllerContext } from "@/components/Global/Contexts/CommentDataProvider"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { parsePastLogQuery } from "@/utils/pastLogQuery"
import { IconExclamationCircle, IconHistoryToggle } from "@tabler/icons-react"

export type PendingPastLog = {
    when: number
    key: string
}

/**
 * `?past_log=<unixepoch>` クエリから、過去ログ読み込みの確認を促す状態(pendingPastLog)を導出する (Issue #58)。
 * レンダー中に導出するためuseEffectは使わない。確認済みのキーは consumedKeys に保持し、
 * 同じページセッション内では同じ動画・日時に対して再プロンプトしない。
 */
export function usePastLogQuery() {
    const location = useLocationContext()
    const { videoInfo } = useVideoInfoContext()
    const [consumedKeys, setConsumedKeys] = useState<string[]>([])

    const pendingPastLog = useMemo<PendingPastLog | undefined>(() => {
        const when = parsePastLogQuery(location.search)
        const videoId = videoInfo?.data?.response?.video?.id
        if (when === null || !videoId) return undefined
        const key = `${videoId}:${when}`
        if (consumedKeys.includes(key)) return undefined
        return { when, key }
    }, [location.search, videoInfo, consumedKeys])

    /**
     * 指定されたキーを「確認済み」として消費する。
     * 新規に消費できた場合のみ true を返す。同一キーの二重発火防止のための同期判定。
     */
    const consumePendingPastLog = useCallback((key: string): boolean => {
        if (consumedKeys.includes(key)) return false
        setConsumedKeys(prev => [...prev, key])
        return true
    }, [consumedKeys])

    return { pendingPastLog, consumePendingPastLog }
}

/**
 * URL の `?past_log=<unixepoch>` クエリによる過去ログ読み込みを確認するUI側フック (Issue #58)。
 * CommentDataProvider が導出した pendingPastLog を観測し、アラートでユーザーに確認を取ってから
 * 読み込む(GOサイン)までを担う。showAlert(グローバルなアラートキューへの通知)は外部システムへの
 * 同期としてuseEffectで行うのが妥当。
 */
export function usePastLogConfirm() {
    const { pendingPastLog } = useCommentContentContext()
    const { reloadCommentContent, consumePendingPastLog } = useCommentControllerContext()
    const { showAlert, showToast } = useSetMessageContext()

    useEffect(() => {
        if (!pendingPastLog) return
        // 表示前に pending を消費する。false なら既に消費済み(=再実行)なので表示しない
        if (!consumePendingPastLog(pendingPastLog.key)) return

        const { when } = pendingPastLog
        showAlert({
            icon: <IconHistoryToggle />,
            title: "過去ログを読み込みますか？",
            body: `開かれた URL には過去ログを読み込むクエリが指定されています。\n指定された日時で過去ログを読み込みますか？\n指定日時: ${new Date(when * 1000).toLocaleString()}`,
            customCloseButton: [
                {
                    key: "cancel",
                    text: "キャンセル",
                },
                {
                    key: "load",
                    text: "読み込む",
                    primary: true,
                },
            ],
            onClose: async (type) => {
                if (type !== "load") return
                try {
                    await reloadCommentContent({ when })
                } catch (e) {
                    console.error(e)
                    showToast({
                        title: "過去ログの読み込みに失敗しました",
                        icon: <IconExclamationCircle />,
                    })
                }
            },
        })
    }, [pendingPastLog, consumePendingPastLog, reloadCommentContent, showAlert, showToast])
}
