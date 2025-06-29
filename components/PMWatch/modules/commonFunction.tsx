import { Thread, Comment } from "@/types/CommentData"
import { NgData } from "@/types/NgCommentsApiData"
import { VideoDataThread } from "@/types/VideoData"

export function secondsToTime(seconds: number) {
    const second = Math.floor(seconds % 60)
    const minute = Math.floor((seconds / 60) % 60)
    const hour = Math.floor((seconds / 60) / 60)

    let ss = `${second}`
    let mm = `${minute}`
    let hh = `${hour}`
    
    if (second < 10) ss = `0${ss}`
    if (minute < 10) mm = `0${mm}`

    if (hour < 1) return `${mm}:${ss}`

    if (hour < 10) hh = `0${hh}`
    return `${hh}:${mm}:${ss}`
}

export function timeCalc(operation: string, time: number, currentTime: number, duration: number) {
    // 不要かもしれないが、一応合計時間超過/0未満をハンドルする
    if ( operation == "add" && currentTime + time < 0 ) {
        // 足した結果が0未満
        return 0
    } else if ( operation == "add" && currentTime + time < duration ) {
        // 足した結果が合計時間を超えない
        return time + currentTime
    } else if ( operation == "add" && currentTime + time > duration ) {
        // 足した結果が合計時間を超える
        return duration
    } else if ( operation == "set" && time >= 0 ){
        // 三項演算子 指定された時間が合計時間を超えるなら合計時間に
        return ( time > duration ? duration : time )
    } else if ( operation == "set" && time < 0 ){
        // 指定された時間が0未満
        return 0
    } else {
        throw new Error("Operation not found")
    }
}

export const handleCtrl = (
    e: KeyboardEvent, video: HTMLVideoElement | null,
    commentInput: HTMLTextAreaElement | null,
    onToggleFullscreen: () => void,
    setShortcutFeedback: (text: string) => void,
    onModalStateChanged: (isModalOpen: boolean, modalType: "mylist" | "share" | "help" | "shortcuts") => void
) => {
    if ( e.ctrlKey ) return true;
    if ( e.target instanceof Element ) {
        if ( e.target.closest("input, textarea") ) return true;
    }
    if ( (e.key === " " || e.key === "　") && video ) {
        e.preventDefault()
        if ( video.paused ) {
            video.play()
            setShortcutFeedback("再生")
        } else {
            video.pause()
            setShortcutFeedback("一時停止")
        }
        return false;
    }
    if ( e.key === "ArrowLeft" && video ) {
        e.preventDefault()
        video.currentTime = timeCalc("add", -10, video.currentTime, video.duration)
        setShortcutFeedback("-10 秒")
        return false;
    }
    if ( e.key === "ArrowRight" && video ) {
        e.preventDefault()
        video.currentTime = timeCalc("add", 10, video.currentTime, video.duration)
        setShortcutFeedback("+10 秒")
        return false;
    }
    if ( e.key === "," && video ) {
        e.preventDefault()
        video.currentTime = timeCalc("add", -1 / 60, video.currentTime, video.duration)
        setShortcutFeedback("-16 ミリ秒")
        return false;
    }
    if ( e.key === "." && video ) {
        e.preventDefault()
        video.currentTime = timeCalc("add", 1 / 60, video.currentTime, video.duration)
        setShortcutFeedback("+16 ミリ秒")
        return false;
    }
    if ( e.key.toLowerCase() === "c" ) {
        if (!commentInput) return
        // 入力を防ぐために preventDefaultしてからフォーカス(後でreturnしたら間に合わない)
        e.preventDefault()
        commentInput.focus()
        setShortcutFeedback("コメントリストへフォーカス")
        return false;
    }
    if ( e.key.toLowerCase()  === "f" ) {
        e.preventDefault()
        onToggleFullscreen()
        return false;
    }
    if ( e.key.toLowerCase() === "m" && video ) {
        e.preventDefault()
        if (video.muted) {
            setShortcutFeedback("ミュート解除")
        } else setShortcutFeedback("ミュート");
        video.muted = !video.muted
        return false;
    }
    if ( e.key.toLowerCase() === "?" ) {
        e.preventDefault()
        onModalStateChanged(true, "shortcuts")
        return false;
    }
}

export function readableInt(number: number, maxLength = Infinity) {
    const units = ["万","億","兆","京","垓","秭","穣","溝","潤","正","載","極","恒河沙","阿僧祇","那由他","不可思議","無量大数"]
    if ( number.toString().indexOf("e") == -1 ) {
        const stringArray = number.toString().split("").reverse()
        const length = Math.ceil(stringArray.length / 4)
        const splitArray = new Array(length).fill("").map((_, index) => stringArray.slice(index * 4, (index + 1) * 4))
        const afterStringArray = splitArray.map((chars, index) => {
            if (splitArray[index - 1] && units[index - 1] && splitArray[index - 1].length === 4) {
                return [units[index - 1], ...chars]
            } else {
                return chars
            }
        })
        /*const afterStringArray = stringArray.map((char, index) => {
            if ((index) % 4 !== 0) return char
            return `${char}${units[((index) / 4) - 1] || ""}`
        })*/
        return afterStringArray.reverse().slice(0, maxLength).reduce((prev,current) => current.concat(prev), []).reverse().join("")
    } else {
        return number
    }
}

// https://dic.nicovideo.jp/a/ng%E5%85%B1%E6%9C%89%E6%A9%9F%E8%83%BD より。
// noneは-100万を超えるNGスコアを持つコメントがない前提でやってる…ないよな？
export const sharedNgLevelScore = {
    "low": -10000,
    "mid": -4800,
    "high": -1000,
    "none": -1000000,
}

export function doFilterThreads(threads: Thread[], sharedNgLevel: number, viewerNg?: NgData | null ) {
    const threadsAfter = threads.map((thread) => {
        if ( thread.fork === "owner" ) return thread
        const comments = doFilterComments(thread.comments, sharedNgLevel, viewerNg)
        return { ...thread, comments }
    })
    return threadsAfter
}

export function applyOpacityToThreads(threads: Thread[], threadLabels: string[], opacitySetting: { [key: string]: number }) {
    return threads.map((thread, index) => {
        return { ...thread, comments: thread.comments.map(comment => {
            return { ...comment, commands: [...comment.commands, `nico:opacity:${opacitySetting[threadLabels[index]] ?? 1}`] }
        }) }
    })
}

export function doFilterComments(comments: Comment[], sharedNgLevel: number, viewerNg?: NgData | null, onlyShowMyselfComments?: boolean) {
    return comments.filter((comment) => {
        if (onlyShowMyselfComments && !comment.isMyPost) return false 
        if ( comment.score < sharedNgLevel ) return false
        if (viewerNg && viewerNg.items.findIndex(elem => {
            if (elem.type === "command" && comment.commands.findIndex(command => elem.source === command) !== -1) return true
            if (elem.type === "id" && comment.userId === elem.source) return true
            if (elem.type === "word" && comment.body.includes(elem.source)) return true
            return false
        }) !== -1) return false
        return true
    })
}

export function returnThreadLabels(threads: VideoDataThread[]) {
    return threads.map(thread => thread.label)
}

export function wheelTranslator(e: WheelEvent) {
    if (
        Math.abs(e.deltaY) < Math.abs(e.deltaX) ||
        !e.currentTarget ||
        !(e.currentTarget instanceof HTMLDivElement) ||
        e.currentTarget.scrollWidth <= e.currentTarget.clientWidth
    )
        return;

    if (
        (e.deltaY > 0 && e.currentTarget.scrollLeft >= e.currentTarget.scrollWidth - e.currentTarget.clientWidth - 1) ||
        (e.deltaY < 0 && e.currentTarget.scrollLeft <= 0)
    )
        return;

    e.preventDefault();
    if (e.currentTarget.scrollLeft + e.deltaY > e.currentTarget.scrollWidth - e.currentTarget.clientWidth) {
        e.currentTarget.scrollLeft = e.currentTarget.scrollWidth - e.currentTarget.clientWidth
    } else if ( e.currentTarget.scrollLeft + e.deltaY < 0 ) {
        e.currentTarget.scrollLeft = 0
    } else {
        e.currentTarget.scrollLeft += e.deltaY;
    }
}
