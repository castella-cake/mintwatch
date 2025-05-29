import { useEffect, useRef } from "react";
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import { wheelTranslator } from "../commonFunction";
import { useCommonsRelativeData } from "@/hooks/apiHooks/watch/CommonsRelativeData";

function BottomInfo() {
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
            className="videoinfo-container bottominfo-container"
            id="pmw-bottominfo"
        >
            <div className="videoinfo-title">コンテンツツリー</div>
            <div className="contenttree-kind-container">
                <div className="contenttree-title">親作品</div>
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
                <div className="contenttree-title">子作品</div>
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

export default BottomInfo;
