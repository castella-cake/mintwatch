import { redirectResponse } from "@/types/generic/redirectResponse"

export function isRedirectResponse(response: { [key: string]: any }): response is redirectResponse {
    return typeof response === "object" && response?.meta?.status === 302 && response?.meta?.code === "HTTP_302" && typeof response?.data?.location === "string" && URL.canParse(response?.data?.location)
}
