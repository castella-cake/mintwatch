import { RefObject, useEffect, useRef } from "react"

export function useOutsideClose(
    nodeRef: RefObject<HTMLElement | null>,
    isOpen: boolean,
    onClose: () => void,
    ignoreId?: string,
) {
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose

    useEffect(() => {
        if (!isOpen) return
        function handleMouseDown(e: MouseEvent) {
            const target = e.target as Node
            if (nodeRef.current?.contains(target)) return
            if (ignoreId) {
                const closest = (target as Element).closest?.(`[data-outside-ignore="${ignoreId}"]`)
                if (closest) return
            }
            onCloseRef.current()
        }
        document.addEventListener("mousedown", handleMouseDown)
        return () => document.removeEventListener("mousedown", handleMouseDown)
    }, [nodeRef, isOpen, ignoreId])
}
