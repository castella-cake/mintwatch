import { SearchNicodic } from "@/types/search/tagData"
import "./styles/DictionarySummary.css"

export function DictionarySummaryTitle({ nicodic, originalKeyword }: { nicodic: SearchNicodic, originalKeyword?: string }) {
    return (
        <div className="search-nicodic-container">
            <p className="search-nicodic-summary" data-is-active={nicodic.summary !== null}>
                {nicodic.summary
                    ? (
                            <>
                                {nicodic.summary}
                                <strong>…</strong>
                            </>
                        )
                    : "このタグの単語記事がまだありません。"}
            </p>
            <a href={nicodic.url} target="_blank" rel="noreferrer noopener" className="search-nicodic-link">
                {nicodic.title !== originalKeyword && `${nicodic.title} の`}
                {nicodic.summary ? "記事を読む" : "記事ページを開く"}
            </a>
        </div>
    )
}
