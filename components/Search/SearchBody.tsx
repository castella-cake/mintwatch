import { useLocationContext } from "../Router/RouterContext"
import { KeywordSearch } from "./KeywordSearch"
import { TagSearch } from "./TagSearch"

export function SearchBody() {
    const location = useLocationContext()
    return (
        <div className="container page-search-container">
            {location.pathname.startsWith("/search") && <KeywordSearch />}
            {location.pathname.startsWith("/tag") && <TagSearch />}
        </div>
    )
}
