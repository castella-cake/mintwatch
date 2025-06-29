import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

type IAlertButton = {
    text: string;
    key: string;
    disabled?: boolean;
    primary?: boolean;
}

type IAlert = {
    icon?: ReactNode;
    title: string;
    body?: ReactNode;
    type?: string;
    customCloseButton?: IAlertButton[];
    onClose?: (type: null | string) => void;
}
const IAlertContext = createContext<IAlert[]>([]);
const ISetAlertContext = createContext<{ ISetAlertState: Dispatch<SetStateAction<IAlert[]>>, showAlert: (alert: IAlert) => void }>({ ISetAlertState: () => {}, showAlert: () => {}});

export function AlertProvider({ children }: { children: ReactNode }) {
    const [IAlertState, ISetAlertState] = useState<IAlert[]>([])
    const showAlert = useCallback((alert: IAlert) => {
        ISetAlertState(current => [...current, alert])
    }, [ISetAlertContext])
    return (
        <IAlertContext value={IAlertState}>
            <ISetAlertContext value={{ ISetAlertState, showAlert }}>
                {children}
            </ISetAlertContext>
        </IAlertContext>
    );
}

export function useAlertContext() {
    return useContext(IAlertContext);
}

export function useSetAlertContext() {
    return useContext(ISetAlertContext);
}