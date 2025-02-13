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
    ],
}

export default settings