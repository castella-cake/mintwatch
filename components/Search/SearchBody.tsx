import { useLocationContext } from "../Router/RouterContext"
import { KeywordSearch } from "./KeywordSearch"
import { MylistSearch } from "./MylistSearch"
import { SeriesSearch } from "./SeriesSearch"
import { TagSearch } from "./TagSearch"

export function SearchBody() {
    const location = useLocationContext()
    return (
        <div className="container page-search-container">
            {location.pathname.startsWith("/search/") && <KeywordSearch />}
            {location.pathname.startsWith("/tag/") && <TagSearch />}
            {location.pathname.startsWith("/mylist_search/") && <MylistSearch />}
            {location.pathname.startsWith("/series_search/") && <SeriesSearch />}
        </div>
    )
}
