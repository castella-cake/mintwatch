import { IconDots, IconDotsVertical } from "@tabler/icons-react"
import { useState } from "react"
import { HistoryAnchor } from "../Router/HistoryAnchor"
import { useHistoryContext, useLocationContext } from "../Router/RouterContext"

interface PageInputButtonProps {
    maxPage: number
    children?: React.ReactNode
}

function PageInputButton({ maxPage, children }: PageInputButtonProps) {
    const location = useLocationContext()
    const history = useHistoryContext()
    const [inputPage, setInputPage] = useState<string>("")
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false)

    const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(inputPage)
            if (pageNum >= 1 && pageNum <= maxPage) {
                const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
                pathUrl.searchParams.set("page", pageNum.toString())
                history.push(pathUrl.toString())
                window.scrollTo(0, 0)
            }
            setIsInputVisible(false)
            setInputPage("")
        } else if (e.key === "Escape") {
            setIsInputVisible(false)
            setInputPage("")
        }
    }

    return (
        <button
            className="pageselector-page-blank"
            onClick={() => setIsInputVisible(true)}
            type="button"
            title="ページ番号を入力"
        >
            {isInputVisible
                ? (
                        <input
                            type="number"
                            value={inputPage}
                            onChange={e => setInputPage(e.target.value)}
                            onKeyDown={handlePageInput}
                            onBlur={() => {
                                setIsInputVisible(false)
                                setInputPage("")
                            }}
                            autoFocus
                            min="1"
                            max={maxPage}
                            placeholder="ページ"
                            className="pageselector-page-input"
                        />
                    )
                : children}
        </button>
    )
}

export function PageSelector({ pagination, currentItemCount, vertical = false }: { pagination: GenericPagination, currentItemCount?: number, vertical?: boolean }) {
    const location = useLocationContext()

    const maxPage = Math.min(pagination.maxPage ?? Infinity, Math.ceil(pagination.totalCount / pagination.pageSize))
    const pages = getPaginationRange(pagination.page, maxPage)
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
            <div className="pageselector-pages">
                {pages.map((p, index) => {
                    if (p === "…") {
                        return (
                            <PageInputButton
                                key={index}
                                maxPage={maxPage}
                            >
                                {vertical ? <IconDotsVertical /> : <IconDots />}
                            </PageInputButton>
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
        </div>
    )
}

function getPaginationRange(
    currentPage: number,
    totalPages: number,
    siblingCount: number = 2,
    allowRange: number = 10,
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
