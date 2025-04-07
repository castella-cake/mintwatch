import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MylistsResponseRootObject } from "@/types/mylistsData";
import { VideoDataRootObject } from "@/types/VideoData";
import { IconCheck } from "@tabler/icons-react";

type Props = {
    onClose: () => void,
    videoInfo: VideoDataRootObject,
}

async function onAddToMylist(mylistId: number, itemId: string, setAddedMylists: Dispatch<SetStateAction<number[]>>) {
    const response = await addItemToMylist(mylistId, itemId, location.href)
    if (response.meta.status === 201) {
        setAddedMylists(( current ) => [ ...current, mylistId ])
        return true
    }
}

export function Mylist({ onClose, videoInfo }: Props) {
    const [ mylistsData, setMylistsData ] = useState<MylistsResponseRootObject | null>(null);
    const [ addedMylists, setAddedMylists ] = useState<number[]>([]);
    useEffect(() => {
        async function getData() {
            const response: MylistsResponseRootObject = await getMylists()
            if (response.meta.status === 200) setMylistsData(response)
        }
        getData()
    }, [])
    const videoTitle = (videoInfo.data.response && videoInfo.data.response.video && videoInfo.data.response.video.title) ? videoInfo.data.response.video.title : "タイトル不明"
    return <div className="mylists-container" id="pmw-mylists">
        <div className="mylists-title videoaction-actiontitle">
            現在の動画をマイリストに追加<br/>
            <span className="mylists-title-addingtitle videoaction-actiontitle-subtitle">
                <span className="mylist-title-addingtitle-videotitle">{videoTitle}</span>
                {" "}を追加します
            </span>
        </div>
        <div className="mylist-item-container">
            {
                mylistsData ? mylistsData.data.mylists.map(elem => {
                    return <button key={ elem.id } className="mylist-item" onClick={() => {
                        if ( !addedMylists.includes(elem.id) && videoInfo.data ) onAddToMylist(elem.id, videoInfo.data.response.video.id, setAddedMylists)
                    }}>
                        {addedMylists.includes(elem.id) && <><IconCheck/>追加済み: </>}
                        <span className="mylist-title">{ elem.name }</span><br/>
                        <span className="mylist-desc">{ elem.isPublic ? "公開" : "非公開" }のマイリスト</span>
                    </button>
                }) : <div>マイリスト取得中</div>
            }
        </div>
    </div>
}