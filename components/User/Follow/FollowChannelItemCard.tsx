import { ChannelFollowee } from "@/types/ChannelFolloweesData"
import { useId } from "react"
import "../../Global/ItemCard/styles/userItem.css"

export function FollowChannelItemCard({ channel, isVerticalLayout, ...additionalAttributes }: { channel: ChannelFollowee, isVerticalLayout?: boolean }) {
    const nicknameId = useId()
    const descriptionId = useId()

    return (
        <div className="useritem-card" key={channel.id} data-layout={isVerticalLayout ? "vertical-simple" : undefined} {...additionalAttributes}>
            <a
                className="useritem-card-link"
                href={channel.url}
                aria-labelledby={nicknameId}
                aria-describedby={channel.description.length > 0 ? descriptionId : undefined}
            />
            <img className="useritem-icon" src={channel.thumbnailSmallUrl} loading="lazy" />
            <div className="useritem-datacolumn">
                <div className="useritem-nickname" id={nicknameId}>
                    {channel.name}
                </div>
                {channel.description.length > 0 && (
                    <div className="useritem-strippeddesc" id={descriptionId}>
                        {channel.description}
                    </div>
                )}
            </div>
        </div>
    )
}
