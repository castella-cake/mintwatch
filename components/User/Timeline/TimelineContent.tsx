import { useLocationContext } from "@/components/Router/RouterContext"
import { NavigationAnchorButton } from "../Navigation"
import { ActivitiesTimeline } from "@/components/Global/Activities/ActivitiesTimeline"
import "../styles/TimelineContent.css"
import { TimelineActorFilterList } from "./TimelineActorFilterList"
import { IconArrowUp } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { pathMatcher } from "@/components/Router/RouterUI"

const validTypes = ["publish", "video", "short_video", "live", "all"] as const
const validActorTypes = ["users", "channels"]

function isValidActorTypes(actorType: unknown): actorType is "users" | "channels" {
    if (typeof actorType !== "string") return false
    return validActorTypes.includes(actorType)
}

export function TimelineContent({ thisUserPageId }: { thisUserPageId?: number }) {
    const queryClient = useQueryClient()
    const location = useLocationContext()
    const hrefPrefix = thisUserPageId ? `/user/${thisUserPageId}/timeline` : `/my/timeline`
    const currentType = location.pathname.replace(`${hrefPrefix}/`, "").replace("postings", "publish")

    const thisSearchParams = new URLSearchParams(location.search)
    const filterActorType = thisSearchParams.get("actorType")
    const filterActorId = thisSearchParams.get("actorId")
    const isActorFilterValid = isValidActorTypes(filterActorType) && filterActorId && Number(filterActorId) > 0
    const filteredSearchParamsString = isActorFilterValid ? `?actorType=${encodeURIComponent(filterActorType)}&actorId=${encodeURIComponent(filterActorId)}` : ""

    const queryFeedRead = useMutation({
        mutationFn: async ({ requestWith, actorType, actorId }: { requestWith: string, actorType: "users" | "channels", actorId: number }) => {
            return await postFeedRead(requestWith, actorType, actorId)
        },
        onSuccess: (_data, { actorType, actorId }) => {
            const actorsData: ActorsDataRootObject | undefined = queryClient.getQueryData(["actor"])
            if (!actorsData) return
            const mutatedActors = actorsData.actors.map((a) => {
                if (a.type !== actorType.slice(0, actorType.length - 1) || a.id !== actorId.toString()) return a
                return { ...a, isUnread: false }
            })
            queryClient.setQueryData(["actor"], { ...actorsData, actors: mutatedActors })
        },
    })

    const lastUpdatedReadRef = useRef({ id: "", type: "" })
    useEffect(() => {
        if (!isActorFilterValid) return
        if (lastUpdatedReadRef.current.id === filterActorId && lastUpdatedReadRef.current.type === filterActorType) return
        queryFeedRead.mutate({
            requestWith: "https://www.nicovideo.jp" + location.pathname + location.search,
            actorType: filterActorType,
            actorId: Number(filterActorId),
        })
        lastUpdatedReadRef.current = { id: filterActorId, type: filterActorType }
        console.log("read updated")
    }, [filterActorType, filterActorId, isActorFilterValid])

    return (
        <div className="user-timeline user-category-container" data-scroll-anchor>
            <div className="user-timeline-sidearea user-category-sidearea">
                <div className="user-category-sidearea-title">
                    種別選択
                </div>
                <DynamicTimelineNavigation
                    href={`${hrefPrefix}/postings`}
                    actorSearchParams={filteredSearchParamsString}
                    otherMatchings={[`/user/${thisUserPageId}!`, `/my!`]}
                >
                    コンテンツ投稿
                </DynamicTimelineNavigation>
                <DynamicTimelineNavigation
                    href={`${hrefPrefix}/video`}
                    actorSearchParams={filteredSearchParamsString}
                >
                    動画投稿
                </DynamicTimelineNavigation>
                <DynamicTimelineNavigation
                    href={`${hrefPrefix}/short_video`}
                    actorSearchParams={filteredSearchParamsString}
                >
                    ショート投稿
                </DynamicTimelineNavigation>
                <DynamicTimelineNavigation
                    href={`${hrefPrefix}/live`}
                    actorSearchParams={filteredSearchParamsString}
                >
                    生放送
                </DynamicTimelineNavigation>
                <DynamicTimelineNavigation
                    href={`${hrefPrefix}/all`}
                    actorSearchParams={filteredSearchParamsString}
                >
                    全て
                </DynamicTimelineNavigation>
                { !thisUserPageId && (
                    <>
                        <div className="user-category-sidearea-title">
                            絞り込み
                        </div>
                        <TimelineActorFilterList currentActorId={filterActorId ?? undefined} currentActorType={filterActorType ?? undefined} />
                    </>
                )}
            </div>
            <div className="user-timeline-content user-category-content">
                <ActivitiesTimeline
                    context={thisUserPageId ? `user_timeline_${thisUserPageId}` : "my_timeline"}
                    type={currentType && validTypes.includes(currentType as typeof validTypes[number]) ? (currentType as typeof validTypes[number]) : "publish"}
                    actorType={!thisUserPageId && isActorFilterValid ? filterActorType : "users"}
                    userId={thisUserPageId ?? (isActorFilterValid ? Number(filterActorId) : undefined)}
                    isActorsQuery={!!thisUserPageId}
                />
            </div>
        </div>
    )
}

function DynamicTimelineNavigation({ children, href, actorSearchParams, otherMatchings }: {
    children: React.ReactNode
    href: string
    actorSearchParams: string
    otherMatchings?: string[]
}) {
    const location = useLocationContext()
    const isCurrentPath = href === location.pathname || otherMatchings?.some(p => pathMatcher(location.pathname, p))
    return (
        <NavigationAnchorButton
            href={`${href}${isCurrentPath ? "" : actorSearchParams}`}
            otherMatchings={otherMatchings ?? []}
        >
            {children}
            {actorSearchParams && isCurrentPath && (
                <span className="user-timeline-navigation-back">
                    <IconArrowUp />
                    <span>
                        戻る
                    </span>
                </span>
            )}
        </NavigationAnchorButton>
    )
}
