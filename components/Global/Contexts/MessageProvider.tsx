import { createContext, Dispatch, ReactNode, SetStateAction } from "react"

type IMessageButton = {
    text: string
    key: string
    disabled?: boolean
    primary?: boolean
}

export type IAlert = {
    icon?: ReactNode
    title: string
    body?: ReactNode
    type?: string
    customCloseButton?: IMessageButton[]
    onClose?: (type: null | string) => void
}

export type IToast = {
    key: string
    icon?: ReactNode
    title: string
    body?: ReactNode
    additionalButton?: IMessageButton[]
    customTimeout?: number
}

const IAlertContext = createContext<IAlert[]>([])
const IToastContext = createContext<IToast[]>([])
const ISetMessageContext = createContext<{
    ISetAlertState: Dispatch<SetStateAction<IAlert[]>>
    showAlert: (alert: IAlert) => void

    ISetToastState: Dispatch<SetStateAction<IToast[]>>
    showToast: (toast: Omit<IToast, "key">) => void
}>({
            ISetAlertState: () => {},
            showAlert: () => {},

            ISetToastState: () => {},
            showToast: () => {},
        })

export function MessageProvider({ children }: { children: ReactNode }) {
    const [IAlertState, ISetAlertState] = useState<IAlert[]>([])
    const [IToastState, ISetToastState] = useState<IToast[]>([])

    const showAlert = useCallback((alert: IAlert) => {
        ISetAlertState(current => [...current, alert])
    }, [ISetMessageContext])
    const showToast = useCallback((toast: Omit<IToast, "key">) => {
        ISetToastState(current => [...current, { ...toast, key: crypto.randomUUID() }])
    }, [ISetMessageContext])

    return (
        <IAlertContext value={IAlertState}>
            <IToastContext value={IToastState}>
                <ISetMessageContext value={{ ISetAlertState, showAlert, ISetToastState, showToast }}>
                    {children}
                </ISetMessageContext>
            </IToastContext>
        </IAlertContext>
    )
}

export function useAlertContext() {
    return useContext(IAlertContext)
}

export function useToastContext() {
    return useContext(IToastContext)
}

export function useSetMessageContext() {
    return useContext(ISetMessageContext)
}
