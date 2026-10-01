export function isVideoInfoOwnerUser(owner: LazyOwnerUser | LazyOwnerChannel | undefined): owner is LazyOwnerUser {
    return owner?.type === "user"
}

export function isVideoInfoOwnerChannel(owner: LazyOwnerUser | LazyOwnerChannel | undefined): owner is LazyOwnerChannel {
    return owner?.type === "channel"
}

export function returnVideoOwnerName(owner: LazyOwnerUser | LazyOwnerChannel | undefined): string | undefined {
    if (!owner) return
    if (isVideoInfoOwnerUser(owner)) {
        return owner.nickname
    }
    if (isVideoInfoOwnerChannel(owner)) {
        return owner.name
    }
}

export function returnVideoOwnerIcon(owner: LazyOwnerUser | LazyOwnerChannel | undefined, preferFullSize?: boolean): string | undefined {
    if (!owner) return
    if (isVideoInfoOwnerUser(owner)) {
        return owner.icon.url
    }
    if (isVideoInfoOwnerChannel(owner)) {
        return preferFullSize ? owner.thumbnail.url : owner.thumbnail.smallUrl
    }
}
