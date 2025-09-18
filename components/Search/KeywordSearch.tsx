import { useSearchKeywordData } from "@/hooks/apiHooks/search/keywordData"
import { useLocationContext } from "../Router/RouterContext"
import "./styleModules/videoItem.css"
import "./styleModules/KeywordSearch.css"
import { VideoItemCard } from "./VideoItemCard"
import { PageSelector } from "../Global/PageSelector"
import { IconLayoutGrid, IconListDetails, IconTag } from "@tabler/icons-react"
import { useSetMessageContext } from "../Global/Contexts/MessageProvider"

export function KeywordSearch() {
    const { searchEnableGridCardLayout } = useStorageVar(["searchEnableGridCardLayout"], "local")
    const { showAlert } = useSetMessageContext()
    const location = useLocationContext()
    const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
    const currentPageIndex = Number.isNaN(Number(pathUrl.searchParams.get("page") ?? "1")) ? 1 : Number(pathUrl.searchParams.get("page") ?? "1")
    const { searchKeywordData: keywordSearchData, error } = useSearchKeywordData(returnSearchWord(location.pathname), currentPageIndex)
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
    if (!keywordSearchData) return (
        <div className="loading-container">
            Loading...
        </div>
    )
    const getSearchVideoData = keywordSearchData?.data.response.$getSearchVideoV2.data
    const page = keywordSearchData.data.response.page.common
    return (
        <div className="search-container">
            <div className="search-title">
                <strong>{getSearchVideoData.keyword}</strong>
                {" "}
                からのキーワード検索結果が
                {" "}
                {getSearchVideoData.totalCount}
                {" "}
                件見つかりました
            </div>
            <PageSelector pagination={page.pagination} vertical={true} />
            <div className="search-result-relatedtags">
                <h3>
                    <IconTag />
                    関連するタグで検索
                </h3>
                {getSearchVideoData.additionals.tags.map((tag) => {
                    return (
                        <div className="search-result-relatedtags-tag" key={`${tag.type}-${tag.text}`}>
                            {tag.text}
                        </div>
                    )
                })}
            </div>
            <div className="search-display-selector">
                <button title="リスト表示" data-is-active={!searchEnableGridCardLayout} onClick={() => { storage.setItem("local:searchEnableGridCardLayout", false) }}><IconListDetails /></button>
                <button title="グリッド表示" data-is-active={searchEnableGridCardLayout} onClick={() => { storage.setItem("local:searchEnableGridCardLayout", true) }}><IconLayoutGrid /></button>
            </div>
            <div className="search-result-items" data-is-grid-layout={searchEnableGridCardLayout ?? false}>
                {getSearchVideoData.items.map((video, index) => {
                    return (
                        <VideoItemCard video={video} markAsLazy={index >= 5} key={`${index}-${video.id}`} data-index={index + 1 + ((page.pagination.page - 1) * page.pagination.pageSize)} />
                    )
                })}
            </div>
            <PageSelector pagination={page.pagination} />
        </div>
    )
}
