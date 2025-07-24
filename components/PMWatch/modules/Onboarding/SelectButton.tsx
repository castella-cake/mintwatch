import { ReactNode } from "react"

export default function SelectButton({ title, value, storageKey, children }: { title: string, value: string, storageKey: string, children?: ReactNode }) {
    const { syncStorage, setSyncStorageValue } = useStorageContext()

    return (
        <>
            <button
                className="pmw-onboarding-select"
                data-type={storageKey}
                data-value={value}
                data-active={syncStorage[storageKey] === value}
                onClick={() => setSyncStorageValue(storageKey, value)}
            >
                <div className="pmw-onboarding-select-preview">
                    {children}
                </div>
                <div className="pmw-onboarding-select-title">{title}</div>
            </button>
        </>
    )
}
