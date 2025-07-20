import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ReactNode } from "react";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { NavigationObject } from "./NavigationObjects";


function NavigationCustomItemDragOverlay({item}: { item: string | null }) {
    if ( item && item in NavigationObject ) {
        return <div>{NavigationObject[item as keyof typeof NavigationObject].icon}</div>
    }
    return <></>
}

export function NavigationDndWrapper({ children }: { children: ReactNode }) {
    const {syncStorage, setSyncStorageValue} = useStorageContext()
    const [currentDraggingItem, setCurrentDraggingItem] = useState<
        string | null
    >(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const modifiers = [snapCenterToCursor]
    const dropAnimation: DropAnimation = {
        duration: 400,
        easing: "ease",
        keyframes: (() => {
            return [
                { opacity: 1, filter: "blur(0)" },
                { opacity: 0, filter: "blur(16px)" },
            ]
        }),
        /*sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0'
                }
            }
        })*/
    }

    function handleDragEnd(e: DragEndEvent) {
        //console.log(e)
        if (!e.active.id) return;
        const currentSettings = syncStorage.navBarCustomItemList ?? ["recommendations", "history", "ranking"]
        const thisActiveId = e.active.id.toString()
        
        if (thisActiveId.startsWith("sidemenu-")) {
            if (!e.over || !e.over.id) return
            const thisOverId = e.over.id.toString()
            if (currentSettings.includes(thisActiveId.replace("sidemenu-", ""))) return
            if (thisOverId === "navbar-droppable") {
                setSyncStorageValue("navBarCustomItemList", [...currentSettings, thisActiveId.replace("sidemenu-", "")])
                setCurrentDraggingItem(null);
            } else if (thisOverId.startsWith("navbar-")) {
                const overIndex = currentSettings.indexOf(thisOverId.replace("navbar-", ""));
                const afterArray = currentSettings.toSpliced(overIndex, 0, thisActiveId.replace("sidemenu-", ""))
                setSyncStorageValue("navBarCustomItemList", afterArray);
                setCurrentDraggingItem(null);
            }
        } else if (e.active.id.toString().startsWith("navbar-") && e.over && e.over.id) {
            const thisOverId = e.over.id.toString()
            const oldIndex = currentSettings.indexOf(thisActiveId.replace("navbar-", ""));
            const newIndex = currentSettings.indexOf(thisOverId.replace("navbar-", ""));
            const sortAfter = arrayMove(currentSettings, oldIndex, newIndex);
            setSyncStorageValue("navBarCustomItemList", sortAfter);
            setCurrentDraggingItem(null);
        } else if (e.active.id.toString().startsWith("navbar-")) {
            setSyncStorageValue("navBarCustomItemList", currentSettings.filter((item: string) => item !== thisActiveId.replace("navbar-", "")));
            setCurrentDraggingItem(null);
        }
    }
    function handleDragStart(e: DragStartEvent) {
        //console.log(e)
        if (!e.active.id) return;
        if (e.active.id.toString().startsWith("sidemenu-")) {
            setCurrentDraggingItem(e.active.id.toString().replace("sidemenu-", ""));
        } else if (e.active.id.toString().startsWith("navbar-")) {
            setCurrentDraggingItem(e.active.id.toString().replace("navbar-", ""));
        }
        
        //setIsDraggingInfoCard(true)
    }

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
        >
            {children}
            <DragOverlay className="navigation-custom-drag-overlay" modifiers={modifiers} dropAnimation={dropAnimation}>
                <NavigationCustomItemDragOverlay item={currentDraggingItem}/>
            </DragOverlay>
        </DndContext>
    );
}
