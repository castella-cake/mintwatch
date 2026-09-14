import { ServerContextRootObject } from "@/types/serverContextData"

export default function useServerContext() {
    const serverContextMwElements = document.getElementsByName("server-context-mw")
    if (
        serverContextMwElements.length > 0
        && typeof serverContextMwElements[0].getAttribute("content") === "string"
    ) {
        return JSON.parse(
            serverContextMwElements[0].getAttribute("content")!,
        ) as ServerContextRootObject
    }
    const serverContextElements = document.getElementsByName("server-context")
    if (
        serverContextElements.length > 0
        && typeof serverContextElements[0].getAttribute("content") === "string"
    ) {
        return JSON.parse(
            serverContextElements[0].getAttribute("content")!,
        ) as ServerContextRootObject
    }
    return null
}
