import { WatchV4Data } from "./Base"
import { WatchLazyData } from "./Lazy"

// BaseとLazyを結合した型。Lazy側はPartial
export type VideoInfo = WatchV4Data & Partial<WatchLazyData>
