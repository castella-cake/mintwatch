import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import { useChannelVideoDAnimeLinksData } from "@/hooks/apiHooks/watch/channelVideoDAnimeLinksData";

export default function DAnimeLinks() {
    const {videoInfo} = useVideoInfoContext()
    const { channelVideoDAnimeLinksData, isLoading } = useChannelVideoDAnimeLinksData(videoInfo?.data.response.video.id)
    if (isLoading || !channelVideoDAnimeLinksData) return <div className="channel-danime-links-container">
        <div className="channel-danime-links-title" style={{ opacity: 0.5 }}>代替の有料チャンネルを検索しています…</div>
    </div>
    const dAnimeLinks = channelVideoDAnimeLinksData.data.items

    if (!dAnimeLinks || dAnimeLinks.length === 0) return <div className="channel-danime-links-container">
        <div className="channel-danime-links-title" style={{ opacity: 0.5 }}>利用可能な代替チャンネルは見つかりませんでした</div>
    </div>

    return <div className="channel-danime-links-container">
        <div className="channel-danime-links-title">この動画は以下のチャンネルでも視聴できます</div>
        {dAnimeLinks.map(item => (
            <div className="channel-danime-links-item" key={item.channel.id}>
                <a href={item.channel.url} className="channel-danime-links-channel">
                    <img className="channel-danime-links-channel-icon" src={item.channel.thumbnailUrl} alt={`${item.channel.name} のアイコン`}/>
                    <span className="channel-danime-links-channel-name">{item.channel.name}</span>
                    <span className="channel-danime-links-channel-status">
                        {item.isChannelMember ? "加入中" : "未加入"}
                    </span>
                </a>
                <a href={`https://www.nicovideo.jp/watch/${item.linkedVideoId}`} className="channel-danime-links-watch-link">
                    {item.channel.name} で見る
                </a>
            </div>
        ))}
    </div>
}