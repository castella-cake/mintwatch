import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useUserVideoData } from "@/hooks/apiHooks/watch/userVideoData"
import { UserVideosOptionSelector } from "./UserVideosOptionSelector"
import { PageSelector } from "@/components/Global/PageSelector"
import { useLocationContext } from "@/components/Router/RouterContext"

const validOrder = ["asc", "desc"]

export function Videos({ userId, contentType = "long" }: { userId: number, contentType?: "long" | "short" }) {
    const { userEnableGridCardLayout } = useStorageVar(["userEnableGridCardLayout"], "local")
    const location = useLocationContext()
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page") || "1"
    const sortKey = searchParams.get("sortKey") || "registeredAt"
    const sortOrder: "asc" | "desc" = validOrder.includes(searchParams.get("sortOrder") ?? "") ? searchParams.get("sortOrder") as "asc" | "desc" : "desc"
    const userVideoData = useUserVideoData(userId, sortKey, sortOrder, contentType, "mask", 100, parseInt(page))
    const isHorizontalCardLayout = userEnableGridCardLayout

    return (
        <div className="user-videos-content user-category-content">
            <div className="user-videos-title">
                <strong>{userVideoData?.data.totalCount ?? 0}</strong>
                {" "}
                件の
                {contentType === "short" ? "ショート" : "動画"}
            </div>
            <UserVideosOptionSelector>
                <PageSelector pagination={{
                    page: parseInt(page),
                    totalCount: userVideoData?.data.totalCount ?? 0,
                    pageSize: 100,
                    maxPage: Math.ceil((userVideoData?.data.totalCount ?? 0) / 100),
                }}
                />
            </UserVideosOptionSelector>
            <div className="user-videos-items" data-is-grid-layout={userEnableGridCardLayout ?? false}>
                {userVideoData && userVideoData.data.items.map((item, index) => {
                    return (
                        <VideoItemCard
                            key={`userVideos-${item.essential.id}`}
                            video={item.essential}
                            markAsLazy={index >= 5}
                            showStats
                            layoutType={isHorizontalCardLayout ? "vertical-simple" : "horizontal"}
                        />
                    )
                })}
            </div>
            <PageSelector pagination={{
                page: parseInt(page),
                totalCount: userVideoData?.data.totalCount ?? 0,
                pageSize: 100,
                maxPage: Math.ceil((userVideoData?.data.totalCount ?? 0) / 100),
            }}
            />
        </div>
    )
}
