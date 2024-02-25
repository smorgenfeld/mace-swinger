import React from 'react';
import {FC} from "react";
import Item from './item';
import { Draggable } from '@hello-pangea/dnd'

interface IItemDraggable {
    item: Item;
    placeholderText: string;
    index: number
    isStacked: boolean
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

    var tailwindClass = "p-6 flex mx-auto rounded-xl shadow-lg mb-3 "
    var cssToDisableTransition = ""
    if (props.placeholderText === "TRASH") tailwindClass += " bg-red-400";
    else if (props.placeholderText !== "") tailwindClass += " bg-slate-200";
    else if (props.isStacked) {
        tailwindClass += " bg-white w-[100%]"
    }
    else tailwindClass += " bg-white";
    // stacked cards??
    //if (props.isStacked && props.index !== 0) tailwindClass += " -my-8"
    tailwindClass += " z-10 relative"

    /**
    <div ref={setNodeRef} className={tailwindClass} style={style} {...listeners} {...attributes}>
            {title}
        </div>
     */

    
    return (
        <Draggable draggableId={props.item.serialId} index={props.index} isDragDisabled={false}>
            {(provided) => (
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