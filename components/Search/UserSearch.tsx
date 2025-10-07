import { useLocationContext } from "../Router/RouterContext"
import "./styleModules/Search.css"
import { PageSelector } from "../Global/PageSelector"
import { useSetMessageContext } from "../Global/Contexts/MessageProvider"
import { FilterSelector } from "./GenericComponents/FilterSelector"
import { OptionSelector } from "./GenericComponents/OptionSelector"
import { useSearchUserData } from "@/hooks/apiHooks/search/userData"
import { UserItemCard } from "../Global/ItemCard/UserItemCard"
import APIError from "@/utils/classes/APIError"

export function UserSearch() {
    const { searchEnableGridCardLayout } = useStorageVar(["searchEnableGridCardLayout"], "local")
    const { showAlert } = useSetMessageContext()
    const location = useLocationContext()
    const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
    /*
    const currentPageIndex = Number.isNaN(Number(pathUrl.searchParams.get("page") ?? "1")) ? 1 : Number(pathUrl.searchParams.get("page") ?? "1")
    const currentSort = pathUrl.searchParams.get("sort") ?? undefined
    const currentOrder = pathUrl.searchParams.get("order") ?? undefined */
    const reducedObj = [...pathUrl.searchParams.entries()].reduce((prev, entry) => ({ ...prev, [entry[0]]: entry[1] }), {})
    const { searchUserData: userSearchData, error, isFetching } = useSearchUserData(returnSearchWord(location.pathname), reducedObj)
    useEffect(() => {
        if (!userSearchData && error && error.name === "SyntaxError") {
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
    }, [userSearchData, error])
    if (!userSearchData && error) {
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
                                            この条件に該当するユーザーが一人も見つかりませんでした。
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
    if (!userSearchData) return (
        <div className="loading-container">
            Loading...
        </div>
    )
    const getSearchUserData = userSearchData.data.response.$getSearchUser.data
    const page = userSearchData.data.response.page.common
    return (
        <>
            <title>{userSearchData.data.metadata.title}</title>
            <div className="search-container" data-is-fetching={isFetching}>
                <h2 className="search-title">
                    <strong>{returnSearchWord(location.pathname)}</strong>
                    <span className="search-title-totalcount">
                        {getSearchUserData.totalCount
                            ? (
                                    <>
                                        {" - "}
                                        <strong>{getSearchUserData.totalCount}</strong>
                                        {" "}
                                        ユーザーが見つかりました
                                    </>
                                )
                            : ""}
                    </span>
                </h2>
                <PageSelector pagination={page.pagination} currentItemCount={getSearchUserData.items.length} vertical={true} />
                <FilterSelector option={page.option} />
                <OptionSelector option={page.option} />
                <div className="search-result-items" data-is-grid-layout={searchEnableGridCardLayout ?? false}>
                    {
                        getSearchUserData.items.map((item, index) => {
                            return (
                                <UserItemCard key={item.id} user={item} markAsLazy={index > 5} isVerticalLayout={searchEnableGridCardLayout ?? false} />
                            )
                        })
                    }
                </div>
                <PageSelector pagination={page.pagination} currentItemCount={getSearchUserData.items.length} />
            </div>
        </>
    )
}
