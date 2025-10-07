import { IconClockFilled, IconFolderFilled, IconHeartFilled, IconMessageFilled, IconPlayerPlayFilled } from "@tabler/icons-react"

const icons = {
    view: <IconPlayerPlayFilled />,
    comment: <IconMessageFilled />,
    mylist: <IconFolderFilled />,
    like: <IconHeartFilled />,
} as const

export function InfoCardCount({ count, omit, registeredAt }: { count: GenericCount, omit?: (keyof GenericCount)[], registeredAt?: string }) {
    return (
        <>
            {Object.entries(count).map(([key, value]) => (
                (!(omit && omit.includes(key as keyof GenericCount))) && (
                    <span className="info-card-count" data-count-type={key} key={key}>
                        {icons[key as keyof GenericCount]}
                        <span className="info-card-count-value">
                            {readableInt(value, 1)}
                        </span>
                    </span>
                )
            ))}
            {registeredAt && (
                <span className="info-card-count" data-count-type="registeredAt">
                    <IconClockFilled />
                    <span className="info-card-count-value">
                        {relativeTimeFrom(new Date(registeredAt))}
                    </span>
                </span>
            )}
        </>
    )
}
