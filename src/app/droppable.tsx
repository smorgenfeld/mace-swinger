import React from 'react';
import {FC} from "react";
import ItemDraggable from './draggable';
import Item from './item';
import Weapon from './item';
import { Droppable } from '@hello-pangea/dnd'

interface IItemContainer {
    items: Item[];
    newId: string;
    title: string;
}



const ItemContainer: FC<IItemContainer> = (props) => {
  /**const {isOver, setNodeRef} = useDroppable({
    id: "droppable-" + props.newId,
  });
  */

  /**
  const style = {
    color: isOver ? 'green' : undefined,
  };
  */

  const id = props.newId
  
  var itemContainer = "p-4 shrink-0 space-y-4 max-w-sm mx-auto bg-transparent rounded-xl shadow-lg"

  if (props.newId == "trash") {
    itemContainer = "p-4 shrink-0 space-y-4 max-w-sm mx-auto bg-red-500 rounded-xl shadow-lg"
  }

  /* container style */
  function getListStyle(isDraggingOver: boolean) {
    var output = "p-6 block shrink-0 max-w-sm mx-auto rounded-xl shadow-lg w-1/2 "
  
    var color = ["green-100", "slate-100"]
    if (props.newId === "trash") color = ["red-500", "red-400"]
  
    if (isDraggingOver) {
      output += " bg-" + color[0]
    }
    else {
      output += " bg-" + color[1]
    }
    return output
  };


  var titleBlockStyle = "p-2 text-center bg-slate-200 flex shrink-0 max-w-sm mx-auto rounded-xl shadow-lg "
  if (props.title == "") titleBlockStyle = "hidden"

  var phText = "";
  var toMap: Item[] = []
  if (props.items === undefined || props.items.length == 0) {
    /*toMap.push(new Item("temp", "temp", true));*/
    props.newId === "trash" ? phText = "TRASH" : phText = "EMPTY";
  }
  else {
    toMap = [...props.items]
  }

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div className={getListStyle(snapshot.isDraggingOver)}>
          <h2>{props.title}</h2>
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {toMap.map((item, index) => (
              <ItemDraggable key={item.name} item={item} placeholderText={phText} index={index}/>
            ))}
            {provided.placeholder}
            </div>
        </div>
    )}
    </Droppable>
  );
}
/** <div ref={setNodeRef} style={style} className={tailwindClass}>
      {props.children}
    </div>*/

export default ItemContainer;