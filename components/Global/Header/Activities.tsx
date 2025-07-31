import { PublishActivities } from "../Activities/PublishActivities"
import { Actors } from "../Actor"

export default function HeaderActivities() {
    return (
        <div className="header-activities-container" id="pmw-header-activities">
            <div className="header-action-title">
                <div className="header-action-title-left"></div>
                <div className="header-action-title-center">フォロー新着</div>
                <div className="header-action-title-right"></div>
            </div>
            <div className="header-activities-content">
                <Actors />
                <PublishActivities />
            </div>
        </div>
    )
}
