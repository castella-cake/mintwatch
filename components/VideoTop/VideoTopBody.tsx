import { PageTopButton } from "../Global/PageTopButton"
import { VideoTopContent } from "./VideoTopContent"

export function VideoTopBody() {
    return (
        <div className="container page-videotop-container">
            <VideoTopContent />
            <PageTopButton isLabelShown={false} isFixed={true} />
        </div>
    )
}
