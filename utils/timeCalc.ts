export function timeCalc(operation: string, time: number, currentTime: number, duration: number) {
    // 不要かもしれないが、一応合計時間超過/0未満をハンドルする
    if (operation == "add" && currentTime + time < 0) {
        // 足した結果が0未満
        return 0
    } else if (operation == "add" && currentTime + time < duration) {
        // 足した結果が合計時間を超えない
        return time + currentTime
    } else if (operation == "add" && currentTime + time > duration) {
        // 足した結果が合計時間を超える
        return duration
    } else if (operation == "set" && time >= 0) {
        // 三項演算子 指定された時間が合計時間を超えるなら合計時間に
        return (time > duration ? duration : time)
    } else if (operation == "set" && time < 0) {
        // 指定された時間が0未満
        return 0
    } else {
        throw new Error("Operation not found")
    }
}
