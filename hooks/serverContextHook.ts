import ServerContextRootObject from "@/types/serverContextData";

export default function useServerContext() {
    if (
        document.getElementsByName("server-context").length > 0 &&
        typeof document
            .getElementsByName("server-context")[0]
            .getAttribute("content") === "string"
    ) {
        return JSON.parse(
            document
                .getElementsByName("server-context")[0]
                .getAttribute("content")!,
        ) as ServerContextRootObject;
    } else {
        return null
    }
}