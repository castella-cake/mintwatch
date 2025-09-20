import { useLocationContext } from "../Router/RouterContext"
import "./styleModules/videoItem.css"
import "./styleModules/KeywordSearch.css"
import { VideoItemCard } from "./VideoItemCard"
import { PageSelector } from "../Global/PageSelector"
import { useSetMessageContext } from "../Global/Contexts/MessageProvider"
import { FilterSelector } from "./FilterSelector"
import { OptionSelector } from "./OptionSelector"
import { useSearchTagData } from "@/hooks/apiHooks/search/tagData"
import { AdditionalRelatedTags } from "./RelatedTags"
import { DictionarySummaryTitle } from "./DictionarySummary"

export function TagSearch() {
    const { searchEnableGridCardLayout } = useStorageVar(["searchEnableGridCardLayout"], "local")
    const { showAlert } = useSetMessageContext()
    const location = useLocationContext()
    const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
    /*
    const currentPageIndex = Number.isNaN(Number(pathUrl.searchParams.get("page") ?? "1")) ? 1 : Number(pathUrl.searchParams.get("page") ?? "1")
    const currentSort = pathUrl.searchParams.get("sort") ?? undefined
    const currentOrder = pathUrl.searchParams.get("order") ?? undefined */
    const reducedObj = [...pathUrl.searchParams.entries()].reduce((prev, entry) => ({ ...prev, [entry[0]]: entry[1] }), {})
    const { searchTagData: tagSearchData, error, isFetching } = useSearchTagData(returnSearchWord(location.pathname), reducedObj)
    useEffect(() => {
        if (!tagSearchData && error && error.name === "SyntaxError") {
            showAlert({
                title: "エラーが発生しました",
                body: (
                    <>
                        サーバーから無効なJSONが返されました。ほとんどの場合、これは現在旧検索ページを使用している場合に発生します。
                        <br />
                        一度オリジナルのページを表示して、バナーから新検索に切り替えてください。
                        <br />
                        問題が継続する場合は、開発者にお知らせください。
                    </>
                ),
                customCloseButton: [
                    {
                        text: "閉じる",
                        key: "cancel",
                    },
                    {
                        text: "元の検索ページを開く",
                        key: "toNoPmw",
                        primary: true,
                    },
                ],
                onClose: (key) => {
                    if (key === "toNoPmw") {
                        window.location.href = `${window.location.href}${window.location.href.includes("?") ? "&" : "?"}nopmw=true`
                    }
                },
            })
        }
    }, [tagSearchData, error])
    if (!tagSearchData && error) {
        return (
            <div className="search-error">
                <p>
                    APIの呼び出し中にエラーが発生しました:
                    {" "}
                    {error.name}
                </p>

                {error.name === "SyntaxError" && (
                    <p>
                        サーバーから有効なJSONが返されませんでした。
                        <br />
                        ほとんどの場合、これは旧検索を使用している場合に発生します。
                        <br />
                        右上にある「元のページに戻る」ボタンから一度オリジナルのページを表示して、バナーから新検索に切り替えてください。
                    </p>
                )}
            </div>
        )
    }
    if (!tagSearchData) return (
        <div className="loading-container">
            Loading...
        </div>
    )
    const getSearchVideoData = tagSearchData?.data.response.$getSearchVideoV2.data
    const page = tagSearchData.data.response.page.common
    const nicodic = tagSearchData.data.response.page.nicodic
    return (
        <>
            <title>{tagSearchData.data.metadata.title}</title>
            <div className="search-container" data-is-nicodic-article-exists={nicodic.summary !== null} data-is-fetching={isFetching}>
                <h2 className="search-title">
                    <strong>{getSearchVideoData.keyword}</strong>
                    <span className="search-title-totalcount">
                        {getSearchVideoData.totalCount
                            ? (
                                    <>
                                        {" - "}
                                        <strong>{getSearchVideoData.totalCount}</strong>
                                        {" "}
                                        件の動画が見つかりました
                                    </>
                                )
                            : ""}
                    </span>
                </h2>
                <DictionarySummaryTitle nicodic={nicodic} originalKeyword={getSearchVideoData.keyword} />
                <AdditionalRelatedTags getSearchVideoData={tagSearchData?.data.response.$getSearchVideoV2} />
                <PageSelector pagination={page.pagination} vertical={true} />
                <FilterSelector option={page.option} />
                <OptionSelector option={page.option} />
                <div className="search-result-items" data-is-grid-layout={searchEnableGridCardLayout ?? false}>
                    {getSearchVideoData.items.map((video, index) => {
                        return (
                            <VideoItemCard video={video} markAsLazy={index >= 5} key={`${index}-${video.id}`} data-index={index + 1 + ((page.pagination.page - 1) * page.pagination.pageSize)} />
                        )
                    })}
                </div>
                <PageSelector pagination={page.pagination} />
            </div>
        </>
    )
}
