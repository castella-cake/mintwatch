import { Media } from "@/types/watch/Base"

export function isMediaAvailable(media: Media): boolean {
    return !!(media?.hls?.url && media?.accessRightKey && media?.contents?.videos && media?.contents?.audios)
}
