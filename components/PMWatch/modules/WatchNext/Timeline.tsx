import { useVideoTimelineData } from "@/hooks/apiHooks/watch/videoTimelineData";
import { Card } from "../Info/InfoCards";
import { secondsToTime } from "../commonFunction";

const splitWithYMD = (items: VideoTimelineDataRootObject['activities']) => {
    const result: { [key: string]: VideoTimelineDataRootObject['activities'] } = {};

    items.forEach(item => {
        // createdAt を日付文字列に変換(YYYY-MM-DD)
        const thisDate = new Date(item.createdAt)
        const dateStr = `${thisDate.getFullYear()}-${thisDate.getMonth() + 1}-${thisDate.getDate()}`

        if (result[dateStr]) {
            result[dateStr].push(item);
        } else {
            result[dateStr] = [item];
        }
    });

    return result;
};

const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "今日";
    } else if (diffDays === 1) {
        return "昨日";
    } else if (diffDays < 7) {
        return `${diffDays}日前`;
    } else {
        return dateStr.replace(/-/g, "/");
    }
};

export function Timeline() {
    const videoTimeline = useVideoTimelineData()
    
    if (!videoTimeline) return <div className="video-timeline-container">Loading...</div>;

    const splittedActivities = splitWithYMD(videoTimeline.activities)
    return <div className="video-timeline-container">
        {Object.keys(splittedActivities).map((key) => {
            return <div key={`activities-date-${key}`} className="video-timeline-date">
                <div className="video-timeline-date-title">{getRelativeDate(key)}</div>
                <div className="video-timeline-activity-container">
                    {splittedActivities[key].map((item) => {
                        return <div key={`activity-${item.id}`} className="video-timeline-activity">
                            <div className="video-timeline-activity-message-container">
                                <img src={item.actor.iconUrl} className="video-timeline-activity-icon"></img>
                                <div className="video-timeline-activity-message-actor">{item.actor.name}</div>
                                <div className="video-timeline-activity-message">{item.message.text}</div>
                            </div>
                            <Card href={item.content.url} title={item.content.title} thumbnailUrl={item.thumbnailUrl} thumbText={secondsToTime(item.content.video.duration)} subTitle={`${new Date(item.createdAt).toLocaleString("ja-JP")} 投稿`}>
                                {item.content.title}
                            </Card>
                        </div>
                    })}
                </div>
            </div>
        })}
    </div>
}