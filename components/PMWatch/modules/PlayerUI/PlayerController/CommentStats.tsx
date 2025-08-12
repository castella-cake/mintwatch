import { useCommentContentContext } from "@/components/Global/Contexts/CommentDataProvider"
import type { Comment as CommentItem } from "@/types/CommentData"

export function CommentStats({ duration }: { duration: number }) {
    const commentContent = useCommentContentContext()

    const commentStatsCalc = useMemo(() => {
        if (!commentContent) return {}
        const comments = commentContent.data?.threads
            .map(elem => elem.comments)
            .reduce((prev, current) => {
                return prev.concat(current)
            }, [] as CommentItem[])
            .sort((a, b) => a.vposMs - b.vposMs)
        const commentStats: { [key: string]: number } = {}
        if (!comments) return {}
        // 大体要素数が60くらいになるように
        const splitSeconds = duration / 60
        const setMax = 50
        let maxLength = -1

        for (let i = 0; i < (Math.floor(duration) / splitSeconds); i++) {
            // 前の範囲以上、今の範囲内のvposMsでフィルターして数を記録
            const thisLength = comments.filter(elem => elem.vposMs < (i + 1) * (splitSeconds * 1000) && elem.vposMs > i * (splitSeconds * 1000)).length
            commentStats[i * splitSeconds] = thisLength
            // 最高値なら代入
            if (maxLength < thisLength) maxLength = thisLength
        }
        // maxLength は setMax の何倍か
        const lengthScale = maxLength / setMax
        // lengthScaleの値で commentStats をスケール
        for (const key in commentStats) {
            commentStats[key] = Math.floor(commentStats[key] / lengthScale)
        }
        return commentStats
    }, [commentContent, duration])

    return (
        <div className="seekbar-commentstats global-flex">
            {Object.keys(commentStatsCalc).map((keyname) => {
                return <span key={`${keyname}s-index`} className="global-flex1" style={{ ["--height" as any]: `${commentStatsCalc[keyname]}px` }}></span>
            })}
        </div>
    )
}
