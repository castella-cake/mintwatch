import { HistoryAnchor } from "../Router/HistoryAnchor"
import { useLocationContext } from "../Router/RouterContext"

export function PageSelector({ pagination, currentItemCount, vertical = false }: { pagination: GenericPagination, currentItemCount?: number, vertical?: boolean }) {
    const location = useLocationContext()

    const pages = getPaginationRange(pagination.page, Math.min(pagination.maxPage ?? Infinity, Math.ceil(pagination.totalCount / pagination.pageSize)))
    return (
        <div className="pageselector-container" data-is-vertical={vertical}>
            <div className="pageselector-stats-pagination">
                ページ
                {" "}
                {pagination.page}
                {" "}
                -
                {" "}
                計
                {" "}
                {pagination.totalCount}
                {" "}
                件
                {currentItemCount && `中 ${currentItemCount} 件`}
            </div>
            {pages.map((p, index) => {
                if (p === "…") {
                    return (
                        <div className="pageselector-page-blank" key={index}>
                            {p}
                        </div>
                    )
                }
                const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
                pathUrl.searchParams.set("page", p.toString())
                return (
                    <HistoryAnchor key={index} className="pageselector-page-button" data-is-active={p === pagination.page} href={pathUrl.toString()}>
                        {p}
                    </HistoryAnchor>
                )
            })}
        </div>
    )
}

function getPaginationRange(
    currentPage: number,
    totalPages: number,
    siblingCount: number = 2,
    allowRange: number = 25,
): (number | string)[] {
    if (totalPages <= allowRange) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1)
    const rightSibling = Math.min(currentPage + siblingCount, totalPages)

    const showLeftDots = leftSibling > 2
    const showRightDots = rightSibling < totalPages - 1

    const range: (number | string)[] = []
    if (currentPage !== 1) range.push(1)

    if (showLeftDots) range.push("…")

    for (let i = leftSibling; i <= rightSibling; i++) {
        if (!range.includes(i)) range.push(i)
    }

    if (showRightDots) range.push("…")

    if (currentPage !== totalPages && !range.includes(totalPages)) range.push(totalPages)

    return range
}
