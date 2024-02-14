import React from 'react';
import {FC} from "react";
import Item from './item';
import { Draggable } from '@hello-pangea/dnd'

interface IItemDraggable {
    item: Item;
    placeholderText: string;
    index: number
}

const ItemDraggable: FC<IItemDraggable> = (props) => {
    var title = props.item.name
    var isDisabled = false;
    if (props.placeholderText !== "") {
        isDisabled = true;
        title = props.placeholderText;
    }
    /**
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.item.name,
        data: { item: props.item, placeholderText: props.placeholderText},
        disabled: isDisabled
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        touchAction: "none",
    } : {
        touchAction: "none",
    };
    */

    var tailwindClass = "p-6 flex shrink-0 max-w-sm mx-auto rounded-xl shadow-lg"
    if (props.placeholderText === "TRASH") tailwindClass += " bg-red-400";
    else if (props.placeholderText !== "") tailwindClass += " bg-slate-200";
    else tailwindClass += " bg-white";

    /**
    <div ref={setNodeRef} className={tailwindClass} style={style} {...listeners} {...attributes}>
            {title}
        </div>
     */

    
    return (
        <Draggable draggableId={props.item.serialId} index={props.index}>
            {provided => (
                <div
                className={tailwindClass}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                {title}
                </div>
            )}
        </Draggable>
    );
}

export default ItemDraggable;