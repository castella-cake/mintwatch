import { useChannelFolloweesData } from "@/hooks/apiHooks/channel/followeesData"
import { OptionSelector } from "@/components/Global/OptionSelector/OptionSelector"
import { FollowChannelItemCard } from "./FollowChannelItemCard"

export function FollowingChannels() {
    const { channelFolloweesData, error, isLoading } = useChannelFolloweesData()
    const { followChannelsGridLayout } = useStorageVar(["followChannelsGridLayout"], "local")
    const isGridLayout = followChannelsGridLayout ?? false

    if (isLoading) {
        return (
            <div className="user-following-channels-loading">
                フォロー中のチャンネルを取得中
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-following-channels-error">
                フォロー中のチャンネルの取得に失敗しました
            </div>
        )
    }

    return (
        <>
            <OptionSelector gridSwitcherEnabled={isGridLayout} onLayoutSwitch={(enabled) => { storage.setItem("local:followChannelsGridLayout", enabled) }} />
            <div className="user-following-users" data-is-grid-layout={isGridLayout}>
                {channelFolloweesData?.data.map(channel => (
                    <FollowChannelItemCard key={channel.id} channel={channel} isVerticalLayout={isGridLayout} />
                ))}
            </div>
        </>
    )
}
