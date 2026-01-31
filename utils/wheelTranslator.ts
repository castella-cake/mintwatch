export function wheelTranslator(e: WheelEvent) {
    if (
        Math.abs(e.deltaY) < Math.abs(e.deltaX)
        || !e.currentTarget
        || !(e.currentTarget instanceof HTMLDivElement)
        || e.currentTarget.scrollWidth <= e.currentTarget.clientWidth
    )
        return

    if (
        (e.deltaY > 0 && e.currentTarget.scrollLeft >= e.currentTarget.scrollWidth - e.currentTarget.clientWidth - 1)
        || (e.deltaY < 0 && e.currentTarget.scrollLeft <= 0)
    )
        return

    e.preventDefault()
    if (e.currentTarget.scrollLeft + e.deltaY > e.currentTarget.scrollWidth - e.currentTarget.clientWidth) {
        e.currentTarget.scrollLeft = e.currentTarget.scrollWidth - e.currentTarget.clientWidth
    } else if (e.currentTarget.scrollLeft + e.deltaY < 0) {
        e.currentTarget.scrollLeft = 0
    } else {
        e.currentTarget.scrollLeft += e.deltaY
    }
}
