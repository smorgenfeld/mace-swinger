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
    maxSize: number;
    isCurSource: boolean;
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

  /* container style */
  function getListStyle(isDraggingOver: boolean, curChildCount: number) {
    var output = "pl-6 pr-6 pt-3 pb-3 block shrink-0 rounded-xl shadow-lg w-[100%] min-h-36 "
  
    var color = ["bg-green-100", "bg-slate-100"]
    if (props.newId === "trash") color = ["bg-red-600", "bg-red-500"]
    else if (curChildCount >= props.maxSize) color = ["bg-red-200", "bg-red-100"]
  
    if (isDraggingOver) {
      output += color[0]
    }
    else {
      output += color[1]
    }
    return output
  };

  function getChildCount(curChildCount: number) {
    if (props.newId === "trash") return ""
    return "["+curChildCount.toString()+"/"+props.maxSize.toString()+"]"
  }

  function childCountStyle(curChildCount: number) {
    if (curChildCount >= props.maxSize) return 'text-red-500'
    else return 'text-green-500'
  }

  function disableIfTooManyChildren(curChildCount: number) {
    if (props.isCurSource) return false
    else return curChildCount >= props.maxSize
  }


  var titleBlockStyle = "p-2 text-center bg-slate-200 flex shrink-0 max-w-m mx-auto rounded-xl shadow-lg"
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
    <Droppable droppableId={id} isDropDisabled={disableIfTooManyChildren(toMap.length)} >
      {(provided, snapshot) => (
        <div className={getListStyle(snapshot.isDraggingOver, toMap.length)}>
          <h1 className='pb-3'><b>{props.title} </b><b className={childCountStyle(toMap.length)}>{getChildCount(toMap.length)}</b></h1>
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