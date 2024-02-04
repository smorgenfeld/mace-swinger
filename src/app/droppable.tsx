import React from 'react';
import {FC} from "react";
import {useDroppable} from '@dnd-kit/core';
import ItemDraggable from './draggable';
import Item from './item';

interface IItemContainer {
    items: Item[];
    newId: string;
    title: string;
}

const ItemContainer: FC<IItemContainer> = (props) => {
  const {isOver, setNodeRef} = useDroppable({
    id: "droppable-" + props.newId,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  var itemContainer = "p-4 shrink-0 space-y-4 max-w-sm mx-auto bg-transparent rounded-xl shadow-lg"

  if (props.newId == "trash") {
    itemContainer = "p-4 shrink-0 space-y-4 max-w-sm mx-auto bg-red-500 rounded-xl shadow-lg"
  }

  var titleBlockStyle = "p-2 text-center bg-slate-200 flex shrink-0 max-w-sm mx-auto rounded-xl shadow-lg "
  if (props.title == "") titleBlockStyle = "hidden"

  var phText = "";
  var toMap = [...props.items]
  if (props.items.length == 0) {
    toMap.push(new Item("temp", "temp", true));
    props.newId === "trash" ? phText = "TRASH" : phText = "EMPTY";
    }
  
  return (
    <ul className={itemContainer} ref={setNodeRef}>
        <div className={titleBlockStyle}><h1 className='text-1xl text-right'>{props.title}</h1></div>
        {toMap.map((item) => (
            <ItemDraggable key={item.name} item={item} placeholderText={phText}/>
        ))}
    </ul>

  );
}
/** <div ref={setNodeRef} style={style} className={tailwindClass}>
      {props.children}
    </div>*/

export default ItemContainer;