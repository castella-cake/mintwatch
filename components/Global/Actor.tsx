import useActorQuery from "@/hooks/apiHooks/global/actor"
import { userIdToLiveUrl, userIdToUserUrl } from "@/utils/userIdToUrl"

export function Actors() {
    const actorData = useActorQuery()

    if (!actorData) return <></>

    const filteredActors = actorData.actors.filter(a => a.isLive)
    return (
        <div className="actors-container">
            <div className="actors-title">放送中のユーザー・チャンネル</div>
            <div className="actors">
                {filteredActors.length > 0
                    ? filteredActors.map((actor) => {
                            return (
                                <a
                                    key={`${actor.type}-${actor.id}`}
                                    className="actor"
                                    href={actor.isLive ? userIdToLiveUrl(actor.id) : userIdToUserUrl(actor.id)}
                                    data-is-live={actor.isLive}
                                    data-is-unread={actor.isUnread}
                                    data-type={actor.type}
                                >
                                    <img className="actor-icon" src={actor.iconUrl} alt={`${actor.name} のアイコン`}></img>
                                </a>
                            )
                        })
                    : (
                            <div className="actors-nouser">
                                放送中のユーザーがいると、ここに表示されます
                            </div>
                        )}
            </div>
        </div>
    )
}
