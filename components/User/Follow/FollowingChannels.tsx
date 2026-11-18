import { useChannelFolloweesData } from "@/hooks/apiHooks/channel/followeesData"
import { OptionSelector } from "@/components/Global/OptionSelector/OptionSelector"
import { FollowChannelItemCard } from "./FollowChannelItemCard"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function FollowingChannels() {
    const { channelFolloweesData, error, isLoading } = useChannelFolloweesData()
    const { followChannelsGridLayout } = useStorageVar(["followChannelsGridLayout"], "local")
    const isGridLayout = followChannelsGridLayout ?? false

    if (isLoading) {
        return <LoadingFiller />
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
                { channelFolloweesData && channelFolloweesData.data.length === 0 && (
                    <EmptyNotice contentName="フォロー中のチャンネル" />
                ) }
                {channelFolloweesData?.data.map(channel => (
                    <FollowChannelItemCard key={channel.id} channel={channel} isVerticalLayout={isGridLayout} />
                ))}
            </div>
        </>
    )
}
