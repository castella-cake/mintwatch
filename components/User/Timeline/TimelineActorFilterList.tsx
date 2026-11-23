import { useLocationContext } from "@/components/Router/RouterContext"
import useActorQuery from "@/hooks/apiHooks/global/actor"

const actorTypeParams = {
    user: "users",
    channel: "channels",
}

export function TimelineActorFilterList({ currentActorType, currentActorId }: { currentActorType?: string, currentActorId?: string }) {
    const actorData = useActorQuery()
    const location = useLocationContext()

    if (!actorData) return

    return (
        <div className="user-timeline-actorlist">
            {actorData.actors.map((actor) => {
                const href = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
                const actorType = actorTypeParams[actor.type as keyof typeof actorTypeParams]
                if (!actorType) return
                const isCurrentActorFilter = actorType === currentActorType && currentActorId === actor.id
                if (!isCurrentActorFilter) {
                    href.searchParams.set("actorType", actorType)
                    href.searchParams.set("actorId", actor.id)
                } else {
                    href.searchParams.delete("actorType")
                    href.searchParams.delete("actorId")
                }

                return (
                    <a key={actor.id} className="user-timeline-actor" href={href.toString()} data-is-active={isCurrentActorFilter} data-is-unread={actor.isUnread}>
                        <img className="user-timeline-actor-icon" src={actor.iconUrl} alt={`${actor.name} のアイコン`} />
                        <span className="user-timeline-actor-name">
                            {actor.name}
                        </span>
                    </a>
                )
            })}
        </div>
    )
}
