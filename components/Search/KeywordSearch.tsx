import { useSearchKeywordData } from "@/hooks/apiHooks/search/keywordData"
import { useLocationContext } from "../Router/RouterContext"
import "./styleModules/Search.css"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
import { PageSelector } from "../Global/PageSelector"
import { useSetMessageContext } from "../Global/Contexts/MessageProvider"
import { FilterSelector } from "./GenericComponents/FilterSelector"
import { OptionSelector } from "./GenericComponents/OptionSelector"
import { AdditionalRelatedTags } from "./GenericComponents/RelatedTags"
import APIError from "@/utils/classes/APIError"
import { LoadingFiller } from "../Global/LoadingFiller"

export function KeywordSearch() {
    const { searchEnableGridCardLayout } = useStorageVar(["searchEnableGridCardLayout"], "local")
    const { showAlert } = useSetMessageContext()
    const location = useLocationContext()
    const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
    /*
    const currentPageIndex = Number.isNaN(Number(pathUrl.searchParams.get("page") ?? "1")) ? 1 : Number(pathUrl.searchParams.get("page") ?? "1")
    const currentSort = pathUrl.searchParams.get("sort") ?? undefined
    const currentOrder = pathUrl.searchParams.get("order") ?? undefined */
    const reducedObj = [...pathUrl.searchParams.entries()].reduce((prev, entry) => ({ ...prev, [entry[0]]: entry[1] }), {})
    const { searchKeywordData: keywordSearchData, error, isFetching } = useSearchKeywordData(returnSearchWord(location.pathname), reducedObj)
    useEffect(() => {
        if (!keywordSearchData && error && error.name === "SyntaxError") {
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
    }, [keywordSearchData, error])
    if (!keywordSearchData && error) {
        if (error instanceof APIError) {
            return (
                <div className="search-error">
                    <h2>
                        {
                            error.response.meta.status === 404
                                ? "検索結果が見つかりません"
                                : "APIの呼び出し中にエラーが発生しました"
                        }
                    </h2>
                    <small className="search-error-name">
                        {error.name}
                        :
                        {" "}
                        {error.response?.meta?.status}
                    </small>
                    <p className="search-error-message">
                        {
                            error.response.meta.status === 404
                                ? (
                                        <>
                                            この条件に該当する動画が一つも見つかりませんでした。
                                            <br />
                                            キーワードやフィルター条件を変更して、再度お試しください。
                                        </>
                                    )
                                : (
                                        <>
                                            予期されていないエラーが発生しました。
                                            <br />
                                            500エラーの場合は、時間を置いてから再度お試しください。
                                        </>
                                    )
                        }
                    </p>
                </div>
            )
        }
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
    if (!keywordSearchData) return <LoadingFiller />
    const getSearchVideoData = keywordSearchData?.data.response.$getSearchVideoV2.data
    const page = keywordSearchData.data.response.page.common
    return (
        <>
            <title>{keywordSearchData.data.metadata.title}</title>
            <div className="search-container" data-is-fetching={isFetching}>
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
                <PageSelector pagination={page.pagination} currentItemCount={getSearchVideoData.items.length} vertical={true} />
                <FilterSelector option={page.option} />
                <AdditionalRelatedTags getSearchVideoData={keywordSearchData?.data.response.$getSearchVideoV2} />
                <OptionSelector option={page.option} />
                <div className="search-result-items" data-is-grid-layout={searchEnableGridCardLayout ?? false}>
                    {getSearchVideoData.items.map((video, index) => {
                        return (
                            <VideoItemCard video={video} markAsLazy={index >= 5} key={`${index}-${video.id}`} data-index={index + 1 + ((page.pagination.page - 1) * page.pagination.pageSize)} isVerticalLayout={searchEnableGridCardLayout ?? false} />
                        )
                    })}
                </div>
                <PageSelector pagination={page.pagination} currentItemCount={getSearchVideoData.items.length} />
            </div>
        </>
    )
}
