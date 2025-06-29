//import { useState } from "react";
import { IconBell, IconBellRingingFilled, IconCategory, IconChevronDown, IconDoorExit, IconTool } from "@tabler/icons-react";
import { useVideoInfoContext } from "../Contexts/VideoDataProvider";
import useOshiraseBellQuery from "@/hooks/apiHooks/global/oshiraseBell";
import { useHeaderActionStateContext, useSetHeaderActionStateContext, useSetMintConfigShownContext } from "../Contexts/ModalStateProvider";
import { HeaderActionStacker } from "./HeaderActionStacker";
import { RefObject } from "react";
import { CSSTransition } from "react-transition-group";
import Notifications from "./Notifications";
import MyMenu from "./MyMenu";
import Navbar from "./Navbar/Navbar";
import SideMenu from "./Navbar/SideMenu";
import { NavigationDndWrapper } from "./Navbar/NavigationCustomDragContext";
import useServerContext from "@/hooks/serverContextHook";

function onVanillaPageReturn() {
    location.href = `${location.href}${location.href.includes("?") ? "&" : "?"}nopmw=true`;
}

function Header({ headerActionStackerElemRef, sideMenuElemRef }: { headerActionStackerElemRef: RefObject<HTMLDivElement | null>, sideMenuElemRef: RefObject<HTMLDivElement | null> }) {
    //const [hover, setHover] = useState(false)
    const { syncStorage } = useStorageContext()
    const { videoInfo } = useVideoInfoContext();
    const contextData = useServerContext()
    const videoViewerInfo = videoInfo?.data.response.viewer;

    const alternativeUserData = contextData && contextData.sessionUser ? {
        nickname: contextData.sessionUser.nickname,
        id: contextData.sessionUser.id,
        isPremium: contextData.sessionUser.type === "premium"
    } : null

    const simplifiedUserData = videoViewerInfo || alternativeUserData || null;

    const setIsMintConfigShown = useSetMintConfigShownContext();
    const headerModalType = useHeaderActionStateContext();
    const setHeaderModalType = useSetHeaderActionStateContext();

    const { oshiraseBellData, setOshiraseBellData } = useOshiraseBellQuery();

    const notificationElemWrapperRef = useRef(null);
    const myMenuElemWrapperRef = useRef(null);

    const isFixedHeaderEnabled = syncStorage.enableFixedHeader ?? getDefault("enableFixedHeader")
    const navbarType = (syncStorage.pmwlayouttype === "shinjuku" && !syncStorage.shinjukuEnableNavbar) ? "disable" : syncStorage.navbarType ?? getDefault("navbarType")
    const headerActionType = syncStorage.headerActionType ?? getDefault("headerActionType")
    const isSetToQuickHeaderAction = headerActionType === "quick"

    const [isEditMode, setIsEditMode] = useState(false)
    
    function onNotificationOpen() {
        setHeaderModalType((state) => state !== "notifications" || isSetToQuickHeaderAction ? "notifications" : false)
        if (oshiraseBellData) setOshiraseBellData({ ...oshiraseBellData, data: { ...oshiraseBellData.data, badge: false }})
    }
    function onMyMenuOpen() {
        setHeaderModalType((state) => state !== "mymenu" || isSetToQuickHeaderAction ? "mymenu" : false)
    }

    return (
        <NavigationDndWrapper>
        <div className="header-container" id="pmw-header" data-is-fixed={isFixedHeaderEnabled} data-navbar-type={navbarType}>
            <div className="header-upper-container global-flex">
                <div className="global-flex1 header-left-container global-flex">
                    <button
                        onClick={() => {
                            setIsMintConfigShown((current) => !current);
                        }}
                        title="MintWatch の設定"
                    >
                        <IconTool />
                    </button>
                </div>
                <div className="global-flex1 global-flex header-center-container">
                    <div className="header-center-left">
                        <a href="https://www.nicovideo.jp" title="ニコニコトップ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 128 128"
                            >
                                <path
                                    fill="#fff"
                                    d="m54 28-5.33-7-3.27-5c-3.45-6.13.4-8.7 3.58-7.6 3.49 1.21 9.04 10.34 11.36 13.6 1.26 1.76 3.25 5.99 5.71 5.99 2.45 0 4.35-4.23 5.61-5.99 2.32-3.26 7.87-12.39 11.36-13.6 3.18-1.1 7.03 1.47 3.58 7.6l-3.27 5L78 28h23c-2.47 11.2 7.8 21.47 19 19v39c0 5.36.78 13.42-2.7 17.78-3.48 4.36-9.27 4.21-14.3 4.22H24c-13.32-.06-15.98-4.26-16-17V43c.06-4.47.43-9.27 4.22-12.3 3.05-2.43 7.06-2.65 10.78-2.7h31Zm58-3h4v7h7v3h-7v7h-4v-7h-6v-3h6v-7ZM47.53 87.78c11.04 11.02 28.23 7.12 36.78-4.76 4.77-6.63 5.62-13.11 5.64-21 0-4.17.12-16.57 0-19.99-2.47.01-7.82-.01-10-.01-7.54-.02-17.07-.8-24 1.92-10.1 3.97-19.52 14.6-18.48 26.08.51 5.61 3.27 10.51 6.48 15-4.11 4.11-10.77 10.02-8.59 12.2 2.33 2.16 7.77-5.31 12.17-9.44ZM85 47c-.22 17.7 2.73 26.19-9 36.9-1.84 1.68-4.62 4.03-6.96 4.97-3.92 1.59-15.87-.44-17.52-4.91 2.61-3.09 9.37-9.39 11.68-12.02.81-.93 4.23-3.98 2.37-5.46-2.27-2.13-5.69 2.82-6.57 3.6-2.63 2.31-8.96 9.18-11.43 10.7-4.57-2.51-5.42-14.77-3.83-18.69.94-2.34 2.68-4.25 4.36-6.09 10.71-11.73 22.41-9 36.9-9Z"
                                />
                            </svg>
                        </a>
                        <a href="https://www.nicovideo.jp/video_top">動画</a>
                        <a href="https://seiga.nicovideo.jp">静画</a>
                        <a href="https://live.nicovideo.jp">生放送</a>
                        <a href="https://ch.nicovideo.jp">チャンネル</a>
                        <a href="https://dic.nicovideo.jp">大百科</a>
                        <a href="https://originalnews.nico/464285">実況</a>
                        <a href="https://anime.nicovideo.jp">Nアニメ</a>
                    </div>
                    <div className="header-center-right">
                        <div className="global-flex header-usercontainer">
                            <button
                                className="header-notificationbutton"
                                onClick={onNotificationOpen}
                                onMouseEnter={() => {if (isSetToQuickHeaderAction) onNotificationOpen()}}
                                onMouseLeave={() => {if (isSetToQuickHeaderAction) setHeaderModalType(false)}}
                                data-is-active={headerModalType === "notifications"}
                                title="通知"
                            >
                                { oshiraseBellData && oshiraseBellData.data.badge ? <IconBellRingingFilled/>  : <IconBell/> }
                            </button>
                            { !isSetToQuickHeaderAction && <button
                                className="header-mymenubutton"
                                onClick={onMyMenuOpen}
                                data-is-active={headerModalType === "mymenu"}
                                title="マイメニュー"
                            >
                                <IconCategory/>
                            </button> }
                            {simplifiedUserData && (
                                <a
                                    href="https://www.nicovideo.jp/my"
                                    className="header-account"
                                    onMouseEnter={() => {if (isSetToQuickHeaderAction) onMyMenuOpen()}}
                                    onMouseLeave={() => {if (isSetToQuickHeaderAction) setHeaderModalType(false)}}
                                    data-is-active={headerModalType === "mymenu" && isSetToQuickHeaderAction}
                                >
                                    <img
                                        src={`https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${Math.floor(simplifiedUserData.id / 10000)}/${simplifiedUserData.id.toString()}.jpg`}
                                        onError={(e: any) => {
                                            e.target.src =
                                                "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg";
                                        }}
                                        alt="アカウントのアイコン"
                                    />
                                    <span
                                        style={
                                            simplifiedUserData.isPremium
                                                ? { color: "rgb(217, 163, 0)" }
                                                : {}
                                        }
                                    >
                                        {simplifiedUserData.nickname}
                                    </span>
                                    { isSetToQuickHeaderAction && <IconChevronDown/> }
                                </a>
                            )}
                            <CSSTransition
                                nodeRef={notificationElemWrapperRef}
                                in={ headerModalType === "notifications" && isSetToQuickHeaderAction }
                                timeout={300}
                                unmountOnExit
                                classNames="headeraction-quickmodal-transition"
                            >
                                <div className="headeraction-quickmodal-wrapper" ref={notificationElemWrapperRef} onMouseEnter={onNotificationOpen} onMouseLeave={() => setHeaderModalType(false)}>
                                    <Notifications/>
                                </div>
                            </CSSTransition>
                            <CSSTransition
                                nodeRef={myMenuElemWrapperRef}
                                in={ headerModalType === "mymenu" && isSetToQuickHeaderAction }
                                timeout={300}
                                unmountOnExit
                                classNames="headeraction-quickmodal-transition"
                            >
                                <div className="headeraction-quickmodal-wrapper" ref={myMenuElemWrapperRef} onMouseEnter={onMyMenuOpen} onMouseLeave={() => setHeaderModalType(false)}>
                                    <MyMenu />
                                </div>
                            </CSSTransition>
                        </div>
                    </div>
                    
                </div>

                <div className="global-flex1 global-flex header-right-container">
                    <button
                        onClick={onVanillaPageReturn}
                        title="元の視聴ページに戻る"
                    >
                        <IconDoorExit />
                    </button>
                </div>
            </div>
            <div className="header-bottom-container">
                <Navbar isEditMode={isEditMode} setIsEditMode={setIsEditMode}/>
            </div>
            <SideMenu nodeRef={sideMenuElemRef} isEditMode={isEditMode} setIsEditMode={setIsEditMode}/>
            { !isSetToQuickHeaderAction && <HeaderActionStacker nodeRef={headerActionStackerElemRef} /> }
        </div>
        </NavigationDndWrapper>
    );
}

export default Header;
