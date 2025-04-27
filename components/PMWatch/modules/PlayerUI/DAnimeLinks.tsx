import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import { Item } from "@/types/DAnimeLinksData";
import { getChannelVideoDAnimeLinks } from "@/utils/apis/channelVideoDAnimeLinks";

export default function DAnimeLinks() {
    const [dAnimeLinks, setDAnimeLinks] = useState<Item[] | null>(null);
    const {videoInfo} = useVideoInfoContext()
    useEffect(() => {
        async function fetchData() {
            if (videoInfo?.data.response.video && videoInfo?.data.response.video.id) {
                const response = await getChannelVideoDAnimeLinks(videoInfo?.data.response.video.id)
                if (response.meta.status === 200) {
                    setDAnimeLinks(response.data.items)
                }
            } else {
                setDAnimeLinks(null)
            }
        }
        fetchData()
    }, [videoInfo])
    if (!dAnimeLinks || dAnimeLinks.length === 0) return

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