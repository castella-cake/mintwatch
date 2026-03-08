import { IconBell, IconBellRingingFilled, IconCategory, IconChevronDown, IconStar, IconStarFilled } from "@tabler/icons-react"
import { useHeaderActionStateContext, useSetHeaderActionStateContext } from "../Contexts/ModalStateProvider"
import useFeedUnreadQuery from "@/hooks/apiHooks/global/feedUnread"
import useOshiraseBellQuery from "@/hooks/apiHooks/global/oshiraseBell"
import MyMenu from "./MyMenu"
import Notifications from "./Notifications"
import HeaderActivities from "./Activities"
import { CSSTransition } from "react-transition-group"
import { useAccountContext } from "@/hooks/contextHooks"

export function MyButtons({ isQuickHeaderAction }: { isQuickHeaderAction: boolean }) {
    const { oshiraseBellData, setOshiraseBellData } = useOshiraseBellQuery()
    const { feedUnreadData, queryFeedRead } = useFeedUnreadQuery()

    const accountUserData = useAccountContext()
    const headerModalType = useHeaderActionStateContext()
    const setHeaderModalType = useSetHeaderActionStateContext()

    function onNotificationOpen() {
        setHeaderModalType(state => state !== "notifications" || isQuickHeaderAction ? "notifications" : false)
        if (oshiraseBellData) setOshiraseBellData({ ...oshiraseBellData, data: { ...oshiraseBellData.data, badge: false } })
    }
    function onMyMenuOpen() {
        setHeaderModalType(state => state !== "mymenu" || isQuickHeaderAction ? "mymenu" : false)
    }
    function onActivitiesOpen() {
        setHeaderModalType(state => state !== "activities" || isQuickHeaderAction ? "activities" : false)
        if (feedUnreadData?.isUnread) queryFeedRead.mutate(location.toString())
    }

    const notificationElemWrapperRef = useRef(null)
    const myMenuElemWrapperRef = useRef(null)
    const activitiesElemWrapperRef = useRef(null)

    const headerModals = [
        {
            type: "activities" as const,
            ref: activitiesElemWrapperRef,
            Component: HeaderActivities,
        },
        {
            type: "notifications" as const,
            ref: notificationElemWrapperRef,
            Component: Notifications,
        },
        {
            type: "mymenu" as const,
            ref: myMenuElemWrapperRef,
            Component: MyMenu,
        },
    ]

    const handleModalHover = (modalType: typeof headerModals[number]["type"]) => {
        setHeaderModalType(state => state !== modalType || isQuickHeaderAction ? modalType : false)
    }

    return (
        <div className="header-mybuttons-container">
            <button
                className="header-notificationbutton"
                onClick={onActivitiesOpen}
                onMouseEnter={() => { if (isQuickHeaderAction) onActivitiesOpen() }}
                onMouseLeave={() => { if (isQuickHeaderAction) setHeaderModalType(false) }}
                data-is-active={headerModalType === "activities"}
                title="フォロー新着"
            >
                { feedUnreadData?.isUnread ? <IconStarFilled /> : <IconStar /> }
            </button>
            <button
                className="header-notificationbutton"
                onClick={onNotificationOpen}
                onMouseEnter={() => { if (isQuickHeaderAction) onNotificationOpen() }}
                onMouseLeave={() => { if (isQuickHeaderAction) setHeaderModalType(false) }}
                data-is-active={headerModalType === "notifications"}
                title="通知"
            >
                { oshiraseBellData && oshiraseBellData.data.badge ? <IconBellRingingFilled /> : <IconBell /> }
            </button>
            { !isQuickHeaderAction && (
                <button
                    className="header-mymenubutton"
                    onClick={onMyMenuOpen}
                    data-is-active={headerModalType === "mymenu"}
                    title="マイメニュー"
                >
                    <IconCategory />
                </button>
            ) }
            {accountUserData && (
                <a
                    href="https://www.nicovideo.jp/my"
                    className="header-account"
                    onMouseEnter={() => { if (isQuickHeaderAction) onMyMenuOpen() }}
                    onMouseLeave={() => { if (isQuickHeaderAction) setHeaderModalType(false) }}
                    data-is-active={headerModalType === "mymenu" && isQuickHeaderAction}
                >
                    <img
                        src={`https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${Math.floor(accountUserData.id / 10000)}/${accountUserData.id.toString()}.jpg`}
                        onError={(e: any) => {
                            e.target.src
                                                = "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg"
                        }}
                        alt="アカウントのアイコン"
                    />
                    <span
                        style={
                            accountUserData.isPremium
                                ? { color: "rgb(217, 163, 0)" }
                                : {}
                        }
                    >
                        {accountUserData.nickname}
                    </span>
                    { isQuickHeaderAction && <IconChevronDown /> }
                </a>
            )}
            {headerModals.map(modal => (
                <CSSTransition
                    key={modal.type}
                    nodeRef={modal.ref}
                    in={headerModalType === modal.type && isQuickHeaderAction}
                    timeout={300}
                    unmountOnExit
                    classNames="headeraction-quickmodal-transition"
                >
                    <div className="headeraction-quickmodal-wrapper" ref={modal.ref} onMouseEnter={() => handleModalHover(modal.type)} onMouseLeave={() => setHeaderModalType(false)}>
                        <modal.Component />
                    </div>
                </CSSTransition>
            ))}
        </div>
    )
}
