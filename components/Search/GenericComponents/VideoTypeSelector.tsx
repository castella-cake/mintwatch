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
                    let pathUrl: URL
                    if (searchType === "search_shorts") {
                        pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/search_shorts/", "/search/") + location.search)
                    } else if (searchType === "tag_shorts") {
                        pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/tag_shorts/", "/tag/") + location.search)
                    }
                    if (searchType === "search_shorts" || searchType === "tag_shorts") {
                        pathUrl!.searchParams.delete("page")
                        history.push(pathUrl!.toString())
                        window.scrollTo(0, 0)
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
                    let pathUrl: URL
                    if (searchType === "search") {
                        pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/search/", "/search_shorts/") + location.search)
                    } else if (searchType === "tag") {
                        pathUrl = new URL("https://www.nicovideo.jp" + location.pathname.replace("/tag/", "/tag_shorts/") + location.search)
                    }
                    if (searchType === "search" || searchType === "tag") {
                        pathUrl!.searchParams.delete("page")
                        history.push(pathUrl!.toString())
                        window.scrollTo(0, 0)
                    }
                }}
            >
                ショート
            </button>
        </div>
    )
}
