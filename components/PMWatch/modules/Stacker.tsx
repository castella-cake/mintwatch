import { ReactNode } from "react"

type stackerItem = {
    title: string
    content?: ReactNode
    hidden?: boolean
    disabled?: boolean
    icon?: ReactNode
    isIconButton?: boolean
}

export function Stacker({ items }: { items: stackerItem[] }) {
    const [activeTabIndex, setActiveTabIndex] = useState(0)

    return (
        <div className="stacker-wrapper">
            <div className="stacker-container">
                <div className="stacker-tabbutton-container">
                    {items.map((item, index) => {
                        if (item.hidden) return null
                        return (
                            <button
                                key={index}
                                className={`stacker-tabbutton ${activeTabIndex === index ? "stacker-tabbutton-active" : ""}`}
                                onClick={() => {
                                    if (!item.disabled) setActiveTabIndex(index)
                                }}
                                title={item.isIconButton ? item.title : undefined}
                                data-is-icon-button={item.isIconButton}
                                aria-disabled={!!item.disabled}
                            >
                                {item.isIconButton ? item.icon : <span>{item.title}</span>}
                                {!item.isIconButton && item.icon && (
                                    <div className="stacker-tabbutton-icons">
                                        {item.icon}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
                <div className="stacker-content">
                    { items[activeTabIndex].content }
                </div>
            </div>
        </div>
    )
}
