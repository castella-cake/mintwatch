export type setting = {
    type: string,
    name: string,
    values?: any[],
    default?: any,
    href?: string,
    settingLink?: {
        name: string,
        href: string
    },
    children?: setting[],
    min?: number,
    max?: number,
    placeholder?: string,
}

export type settingList = {
    [categoryName: string]: setting[]
}
const settings: settingList = {
    mintwatch: [
        {
            type: "select",
            name: "pmwlayouttype",
            values: ["recresc", "renew", "stacked", "3col", "shinjuku", "rerekari"],
            default: "recresc"
        },
        {
            type: "selectButtons",
            name: "pmwplayertype",
            values: ["default", "html5", "shinjuku"],
            default: "default"
        },
        {
            type: "checkbox",
            name: "pmwforcepagehls",
            default: false,
        },
        {
            type: "group",
            name: "otherSettings",
            children: [
                {
                    type: "checkbox",
                    name: "muteKokenVoice",
                    default: false,
                },
                {
                    type: "inputNumber",
                    name: "wheelGestureAmount",
                    default: 5,
                    min: 1,
                    max: 10,
                },
                {
                    type: "checkbox",
                    name: "disallowGridFallback",
                    default: false,
                }
            ]
        }
    ],
}

export function getDefault(name: string) {
    for (const category of Object.values(settings)) {
        for (const setting of category) {
            if (setting.name === name) return setting.default
            if (setting.children && setting.children.length > 0) {
                for (const child of setting.children) {
                    if (child.name === name) return child.default
                }
            }
        }
    }
    return null
}

export default settings