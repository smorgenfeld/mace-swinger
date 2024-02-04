import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {FC} from "react";
import {CSS} from "@dnd-kit/utilities"
import Item from './item';

interface IItemDraggable {
    item: Item;
    placeholderText: string;
}

const ItemDraggable: FC<IItemDraggable> = (props) => {
    var title = props.item.name
    var isDisabled = false;
    if (props.placeholderText !== "") {
        isDisabled = true;
        title = props.placeholderText;
    }

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

    var tailwindClass = "p-6 flex shrink-0 max-w-sm mx-auto rounded-xl shadow-lg"
    if (props.placeholderText === "TRASH") tailwindClass += " bg-red-400";
    else if (props.placeholderText !== "") tailwindClass += " bg-slate-200";
    else tailwindClass += " bg-white";

    

    
    return (
        <div ref={setNodeRef} className={tailwindClass} style={style} {...listeners} {...attributes}>
            {title}
        </div>
    );
}

export default ItemDraggable;