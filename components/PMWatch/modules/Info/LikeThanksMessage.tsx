import { useSmIdContext } from "@/components/Global/Contexts/WatchDataContext"
import { useLikeMessageDataQuery } from "@/hooks/apiHooks/watch/LikeMessageData"
import { IconCopy, IconX } from "@tabler/icons-react"

export default function LikeThanksMessage({ onMouseEnter, onMouseLeave, onClose, isPermament, iconUrl }: { onMouseEnter: () => void, onMouseLeave: () => void, onClose: () => void, isPermament: boolean, iconUrl?: string | null }) {
    const { smId } = useSmIdContext()
    const [isLikeMsgCopied, setIsLikeMsgCopied] = useState(false)

    const { likeMessageData } = useLikeMessageDataQuery(smId)
    const likeThanksMsg = likeMessageData && likeMessageData.data.thanksMessage ? likeMessageData.data.thanksMessage : ""
    function onLikeMsgCopy() {
        if (!likeThanksMsg) return
        navigator.clipboard.writeText(likeThanksMsg)
        setIsLikeMsgCopied(true)
        setTimeout(() => {
            setIsLikeMsgCopied(false)
        }, 3000)
    }

    return (
        <div className="video-action-likethanks-outercontainer" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="video-action-likethanks-container">
                <div className="global-flex video-action-likethanks-title">
                    <span className="global-flex1">
                        いいね！へのお礼メッセージ
                        <button onClick={onLikeMsgCopy} title="お礼メッセージをコピー" className="video-action-likethanks-copy">
                            <IconCopy />
                            {isLikeMsgCopied && <span className="video-action-likethanks-copied">コピーしました</span>}
                        </button>
                    </span>
                    {isPermament && (
                        <button
                            type="button"
                            title="お礼メッセージを閉じる"
                            onClick={onClose}
                        >
                            <IconX />
                        </button>
                    )}
                </div>
                <div className="global-flex">
                    { iconUrl && (
                        <img
                            src={iconUrl}
                            className="video-action-likethanks-icon"
                        />
                    )}
                    <span className="video-action-likethanks-arrow " />
                    <div className="video-action-likethanks-body global-flex1">
                        {likeThanksMsg}
                    </div>
                </div>
            </div>
        </div>
    )
}
