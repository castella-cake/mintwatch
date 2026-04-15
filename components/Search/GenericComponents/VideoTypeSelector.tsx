import { useHistoryContext, useLocationContext } from "@/components/Router/RouterContext"
import { isCurrentSearchIsShorts } from "@/utils/searchPagePaths"

import "./styles/VideoTypeSelector.css"

export function VideoTypeSelector() {
    const location = useLocationContext()
    const history = useHistoryContext()
    const searchType = returnSearchWhatWeReIn(location.pathname)
    const isShorts = isCurrentSearchIsShorts(location.pathname)
    return (
        <div className="search-videotype-selector">
            <button
                className="search-videotype-selector-item"
                data-isactive={!isShorts}
                data-search-type="video"
                onClick={() => {
                    if (searchType === "search_shorts") {
                        const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/search_shorts/", "/search/") + location.search)
                        history.push(pathUrl.toString())
                    } else if (searchType === "tag_shorts") {
                        const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/tag_shorts/", "/tag/") + location.search)
                        history.push(pathUrl.toString())
                    }
                }}
            >
                動画
            </button>
            <button
                className="search-videotype-selector-item"
                data-isactive={isShorts}
                data-search-type="shorts"
                onClick={() => {
                    if (searchType === "search") {
                        const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/search/", "/search_shorts/") + location.search)
                        history.push(pathUrl.toString())
                    } else if (searchType === "tag") {
                        const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/tag/", "/tag_shorts/") + location.search)
                        history.push(pathUrl.toString())
                    }
                }}
            >
                ショート
            </button>
        </div>
    )
}
