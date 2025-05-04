import { Dispatch, PointerEvent, RefObject, SetStateAction, useMemo } from "react";
import { secondsToTime } from "../commonFunction";

import type { Comment as CommentItem} from "@/types/CommentData";
import { StoryBoardImageRootObject } from "@/types/StoryBoardData";
import { useCommentContentContext } from "@/components/Global/Contexts/CommentDataProvider";

type Props = {
    currentTime: number,
    duration: number,
    showTime: boolean,
    bufferedDuration: number,
    isSeeking: boolean,
    setIsSeeking: Dispatch<SetStateAction<boolean>>,
    tempSeekHandle: (clientX: number) => void,
    seekbarRef: RefObject<HTMLDivElement>,
    storyBoardData?: StoryBoardImageRootObject | null,
}

export function Seekbar({ currentTime, duration, showTime, bufferedDuration, setIsSeeking, tempSeekHandle, seekbarRef, storyBoardData}: Props) {
    const commentContent = useCommentContentContext()
    const [storyBoardX, setStoryBoardX] = useState<number>(0)
    const storyboardCanvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    if (storyboardCanvasRef.current) {
        ctxRef.current = storyboardCanvasRef.current?.getContext("2d")
    }
    const storyboardImgsMemo = useMemo(() => {
        if (!storyBoardData) return []
        return storyBoardData.images.map(imgUrl => {
            const image = new Image()
            image.src = imgUrl.url
            return image
        })
    }, [storyBoardData])

    const onPointerMove = (e: PointerEvent) => {
        const boundingClientRect = seekbarRef.current?.getBoundingClientRect()
        if (!boundingClientRect) return
        let scale = ((e.clientX - boundingClientRect.left) / boundingClientRect.width)
        if ( scale > 1 ) scale = 1
        if ( scale < 0 ) scale = 0
        setStoryBoardX( scale <= 1 ? scale : 1 )
        
        if (storyBoardData && ctxRef.current && storyboardCanvasRef.current) {
            const flooredHoverTime = Math.floor(( scale <= 1 ? scale : 1 ) * duration)
            // intervalで割って、何番目のサムネイルかを計算
            const thumbnailIndex = Math.floor(flooredHoverTime / (storyBoardData.interval / 1000))
            // サムネイルのインデックスから画像インデックスとグリッド位置を計算
            const selectImgIndex = Math.floor(thumbnailIndex / (storyBoardData.columns * storyBoardData.rows))
            const positionInGrid = thumbnailIndex % (storyBoardData.columns * storyBoardData.rows)
            const selectColumn = Math.floor(positionInGrid / storyBoardData.columns)
            const selectRow = positionInGrid % storyBoardData.columns
        
    
            // キャンバスをクリア
            ctxRef.current.clearRect(0, 0, storyboardCanvasRef.current.width, storyboardCanvasRef.current.height)
            
            // 対象の画像が読み込まれているか確認
            if (storyboardImgsMemo[selectImgIndex]) {
                const sourceX = selectRow * storyBoardData.thumbnailWidth
                const sourceY = selectColumn * storyBoardData.thumbnailHeight
                
                // キャンバスのサイズ
                const canvasWidth = storyboardCanvasRef.current.width
                const canvasHeight = storyboardCanvasRef.current.height
                
                // アスペクト比を計算
                const sourceAspect = storyBoardData.thumbnailWidth / storyBoardData.thumbnailHeight
                const canvasAspect = canvasWidth / canvasHeight
                
                // 描画サイズとオフセットを計算
                let drawWidth, drawHeight, offsetX, offsetY
                
                if (sourceAspect > canvasAspect) {
                    // 画像の方が横長の場合
                    drawWidth = canvasWidth
                    drawHeight = canvasWidth / sourceAspect
                    offsetX = 0
                    offsetY = (canvasHeight - drawHeight) / 2
                } else {
                    // 画像の方が縦長の場合
                    drawHeight = canvasHeight
                    drawWidth = canvasHeight * sourceAspect
                    offsetX = (canvasWidth - drawWidth) / 2
                    offsetY = 0
                }
                
                // 画像の切り出しと描画
                ctxRef.current.drawImage(
                    storyboardImgsMemo[selectImgIndex],
                    sourceX,
                    sourceY,
                    storyBoardData.thumbnailWidth,
                    storyBoardData.thumbnailHeight,
                    offsetX,
                    offsetY,
                    drawWidth,
                    drawHeight
                )
            }
        }
    }


    const commentStatsCalc = useMemo(() => {
        if (!commentContent) return {}
        const comments = commentContent.data?.threads
            .map(elem => elem.comments)
            .reduce((prev, current) => {
                return prev.concat(current)
            }, [] as CommentItem[])
            .sort((a, b) => a.vposMs - b.vposMs)
        let commentStats: { [key: string]: number } = {}
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
            if ( maxLength < thisLength ) maxLength = thisLength
        }
        // maxLength は setMax の何倍か
        const lengthScale = maxLength / setMax
        // lengthScaleの値で commentStats をスケール
        for (const key in commentStats) {
            commentStats[key] = Math.floor(commentStats[key] / lengthScale)
        }
        return commentStats
    }, [commentContent, duration])

    function onPointerDown(e: PointerEvent) {
        setIsSeeking(true);
        tempSeekHandle(e.clientX);
        e.preventDefault();
        e.stopPropagation()
    }

    return <div className="seekbar-container" id="pmw-seekbar">
        { showTime && <div className="seekbar-time currenttime">{secondsToTime( currentTime )}</div> }
        <div className="seekbar" ref={seekbarRef} onDragOver={(e) => {e.preventDefault()}}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
        >
            <div className="seekbar-commentstats global-flex">{Object.keys(commentStatsCalc).map((keyname, index) => {
                return <span key={`${keyname}s-index`} className="global-flex1" style={{["--height" as any]: `${commentStatsCalc[keyname]}px`}}></span>
            })}</div>
            <div className="seekbar-bg"></div>
            <div className="seekbar-buffered" style={{ width: `${bufferedDuration / duration * 100}%` }}></div>
            <div className="seekbar-played" style={{ width: `${( currentTime ) / duration * 100}%` }}></div>
            <div className="seekbar-thumb" style={{ ["--left" as any]: `${( currentTime ) / duration * 100}%` }}></div>
            <div className="seekbar-storyboard" style={{ left: `${storyBoardX * 100}%` }}>
                <canvas ref={storyboardCanvasRef} width={160} height={90}/>
                <div className="seekbar-storyboard-time">{secondsToTime(duration * storyBoardX)}</div>
            </div>
        </div>
        { showTime && <div className="seekbar-time duration">{secondsToTime(duration)}</div> }
    </div>
}