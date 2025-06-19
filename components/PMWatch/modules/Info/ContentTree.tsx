import { useEffect, useRef } from "react";
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import { wheelTranslator } from "../commonFunction";
import { useCommonsRelativeData } from "@/hooks/apiHooks/watch/CommonsRelativeData";
import { IconPlus } from "@tabler/icons-react";

function ContentTree() {
    const { videoInfo } = useVideoInfoContext();

    const commonsRelativeData = useCommonsRelativeData(videoInfo?.data.response.video.id, videoInfo && !videoInfo.data.response.external.commons.hasContentTree)
    const parentItemsContainerRef = useRef<HTMLDivElement>(null);
    const childrenItemsContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        parentItemsContainerRef.current?.addEventListener(
            "wheel",
            wheelTranslator,
            { passive: false },
        );
        childrenItemsContainerRef.current?.addEventListener(
            "wheel",
            wheelTranslator,
            { passive: false },
        );
        return () => {
            parentItemsContainerRef.current?.removeEventListener(
                "wheel",
                wheelTranslator,
            );
            childrenItemsContainerRef.current?.removeEventListener(
                "wheel",
                wheelTranslator,
            );
        };
    });
    if (!videoInfo) return <></>;

    return (
        <div
            className="contenttree-container"
            id="pmw-contenttree"
        >
            <div className="contenttree-title">コンテンツツリー</div>
            <a className="contenttree-link" href={`https://commons.nicovideo.jp/works/${videoInfo?.data.response.video.id}/tree/children/edit`}><IconPlus/><span>自分の動画を登録する</span></a>
            <a className="contenttree-link" href={`https://commons.nicovideo.jp/works/${videoInfo?.data.response.video.id}`}>ニコニ・コモンズで見る</a>
            <div className="contenttree-kind-container">
                <div className="contenttree-kind-title">親作品 ({(commonsRelativeData && commonsRelativeData.data.parents.total) ?? 0})</div>
                <div
                    className="contenttree-items-container"
                    ref={parentItemsContainerRef}
                >
                    {commonsRelativeData &&
                    commonsRelativeData.data.parents.total !== 0 ? (
                        commonsRelativeData.data.parents.contents.map(
                            (elem, index) => {
                                return (
                                    <a
                                        className="contenttree-item"
                                        key={`children-${elem.id}`}
                                        href={
                                            elem.watchURL || elem.treeURL || "#"
                                        }
                                    >
                                        <img
                                            src={elem.thumbnailURL}
                                            alt={`${elem.title} のサムネイル`}
                                        />
                                        {elem.title}
                                    </a>
                                );
                            },
                        )
                    ) : (
                        <div className="contenttree-nothinghere">
                            親作品は登録されていません
                        </div>
                    )}
                </div>
            </div>
            <div className="contenttree-kind-container">
                <div className="contenttree-kind-title">子作品 ({(commonsRelativeData && commonsRelativeData.data.children.total) ?? 0})</div>
                <div
                    className="contenttree-items-container"
                    ref={childrenItemsContainerRef}
                >
                    {commonsRelativeData &&
                    commonsRelativeData.data.children.total !== 0 ? (
                        commonsRelativeData.data.children.contents.map(
                            (elem, index) => {
                                return (
                                    <a
                                        className="contenttree-item"
                                        key={`children-${elem.id}`}
                                        href={
                                            elem.watchURL || elem.treeURL || "#"
                                        }
                                    >
                                        <img
                                            src={elem.thumbnailURL}
                                            alt={`${elem.title} のサムネイル`}
                                        />
                                        {elem.title}
                                    </a>
                                );
                            },
                        )
                    ) : (
                        <div className="contenttree-nothinghere">
                            子作品は登録されていません
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContentTree;
