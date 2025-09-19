import { SearchNicodic } from "@/types/search/tagData"

export function DictionarySummaryTitle({ nicodic }: { nicodic: SearchNicodic }) {
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
            <a href={nicodic.url} target="_blank" rel="noreferrer noopener" className="search-nicodic-link">{nicodic.summary ? "ニコニコ大百科で記事を読む" : "ニコニコ大百科で記事ページを開く" }</a>
        </div>
    )
}
