import { LazyOwnerUnavailable } from "@/types/watch/Lazy"

export function isValidVideoInfoOwner(owner: LazyOwnerUser | LazyOwnerChannel | LazyOwnerUnavailable | undefined): owner is LazyOwnerUser | LazyOwnerChannel {
    return (owner?.type === "user" || owner?.type === "channel") && owner?.visibility === "visible"
}

export function isVideoInfoOwnerUser(owner: LazyOwnerUser | LazyOwnerChannel | undefined): owner is LazyOwnerUser {
    return owner?.type === "user"
}

export function isVideoInfoOwnerChannel(owner: LazyOwnerUser | LazyOwnerChannel | undefined): owner is LazyOwnerChannel {
    return owner?.type === "channel"
}

export function returnVideoOwnerName(owner: LazyOwnerUser | LazyOwnerChannel | LazyOwnerUnavailable | undefined, noFallback = false): string | undefined {
    if (!isValidVideoInfoOwner(owner)) {
        return noFallback ? undefined : "非公開または退会済みユーザー"
    }

    if (isVideoInfoOwnerUser(owner)) {
        return owner.nickname
    }
    if (isVideoInfoOwnerChannel(owner)) {
        return owner.name
    }
    return noFallback ? undefined : "不明なユーザー"
}

export function returnVideoOwnerIcon(owner: LazyOwnerUser | LazyOwnerChannel | LazyOwnerUnavailable | undefined, preferFullSize?: boolean): string | undefined {
    if (!isValidVideoInfoOwner(owner)) {
        return
    }

    if (isVideoInfoOwnerUser(owner)) {
        return owner.icon?.url
    }
    if (isVideoInfoOwnerChannel(owner)) {
        return preferFullSize ? owner.thumbnail.url : owner.thumbnail.smallUrl
    }
}
