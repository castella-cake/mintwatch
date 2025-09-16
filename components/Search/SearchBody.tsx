import { useLocationContext } from "../Router/RouterContext"
import { KeywordSearch } from "./KeywordSearch"

export function SearchBody() {
    const location = useLocationContext()
    return (
        <div className="container page-search-container">
            {location.pathname.startsWith("/search") && <KeywordSearch />}
        </div>
    )
}
