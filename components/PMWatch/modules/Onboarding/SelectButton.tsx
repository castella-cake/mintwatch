import { ReactNode } from "react"

export default function SelectButton({ title, value, storageKey, children, ...attributes }: { title: string, value: string, storageKey: string, children?: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const syncStorage = useStorageVar([storageKey])

    return (
        <>
            <button
                className="pmw-onboarding-select"
                data-type={storageKey}
                data-value={value}
                data-active={syncStorage[storageKey] === value}
                onClick={() => storage.setItem(`sync:${storageKey}`, value)}
                {...attributes}
            >
                <div className="pmw-onboarding-select-preview">
                    {children}
                </div>
                <div className="pmw-onboarding-select-title">{title}</div>
            </button>
        </>
    )
}
