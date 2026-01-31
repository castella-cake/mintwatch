// AudioQualityItemとVideoQualityItemのベースとなる型
type QualityItem = {
    isAvailable: boolean
    id: string
}

// クオリティ配列から、利用可能な中で最も良いクオリティのオブジェクトを返す。
export function returnGreatestQuality<T extends QualityItem>(array: T[]): T | false {
    for (const elem of array) {
        if (elem.isAvailable) return elem
    }
    return false
}
