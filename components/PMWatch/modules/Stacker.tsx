import { ReactNode } from "react";

type stackerItem = {
    title: string;
    content?: ReactNode;
    disabled?: boolean;
}

export function Stacker({ items }: { items: stackerItem[] }) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return <div className="stacker-wrapper"><div className="stacker-container">
        <div className="stacker-tabbutton-container">
            {items.map((item, index) => {
                if (item.disabled) return null;
                return <button key={index} className={`stacker-tabbutton ${activeTabIndex === index ? "stacker-tabbutton-active" : ""}`} onClick={() => setActiveTabIndex(index)}>{item.title}</button>
            })}
        </div>
        <div className="stacker-content">
            { items[activeTabIndex].content }
        </div>
    </div>
    </div>
}