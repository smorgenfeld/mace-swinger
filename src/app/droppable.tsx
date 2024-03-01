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
    stacked: boolean
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

  const placeholderItem = new Item("", "", true)

  /* container style */
  function getListStyle(isDraggingOver: boolean, curChildCount: number) {
    var output = "pl-2 pr-2 pt-3 pb-1 block shrink-0 rounded-xl shadow-lg w-[100%] min-h-[10rem] "
  
    var color = ["bg-green-100 dark:bg-green-800", "bg-slate-100 dark:bg-slate-600"]
    if (props.newId === "trash") color = ["bg-red-600", "bg-red-500"]
    else if (props.newId === 'newItems') color = ["bg-slate-100 dark:bg-slate-600", "bg-slate-100 dark:bg-slate-600"]
    else if (curChildCount >= props.maxSize) color = ["bg-red-100 dark:bg-red-900", "bg-red-100 dark:bg-red-900"] //bg-red-200 dark:bg-red-900
  
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
    if (curChildCount >= props.maxSize) return 'text-red-500 dark:text-red-200'
    else return 'text-green-500 dark:text-green-200'
  }

  function disableIfTooManyChildren(curChildCount: number) {
    if (props.stacked) return true
    else if (props.isCurSource) {return false}
    else return curChildCount >= props.maxSize
  }


  var titleBlockStyle = "py-3 text-center bg-slate-200 flex shrink-0 max-w-m mx-auto rounded shadow-lg"
  if (props.title == "") titleBlockStyle = "hidden"

  var phText = "";
  var topCN = "min-h-12"
  var toMap: Item[] = []
  var stackedItem: Item[] = []
  var stackedPlaceholder: Item[] = []
  if (props.items === undefined || props.items.length == 0) {
    /*toMap.push(new Item("temp", "temp", true));*/
    props.newId === "trash" ? phText = "TRASH" : phText = "EMPTY";
  }
  else if (props.stacked) {
    topCN = "absolute [width:calc(100%-1rem)]" //magic number that does not make sense but ok
    if (props.items.length > 0) {toMap = props.items.slice(0, Math.min(1, props.items.length));stackedPlaceholder = toMap}
    else toMap = []
    if (props.items.length > 1) {
      stackedItem = [props.items[1]]
    }
    else stackedItem=[]
  }
  else {
    toMap = [...props.items]
  }

  return (
    <Droppable droppableId={id} isDropDisabled={disableIfTooManyChildren(props.items.length)} >
      {(provided, snapshot) => (
        <div className={getListStyle(snapshot.isDraggingOver, props.items.length)}>
          <h1 className='pb-1 relative text-slate-950 dark:text-slate-50'>&ensp;<b>{props.title} </b><b className={childCountStyle(props.items.length)}>{getChildCount(props.items.length)}</b></h1>
            <div {...provided.droppableProps} ref={provided.innerRef} className={topCN}>
              {toMap.map((item, index) => (
                <ItemDraggable key={item.serialId} item={item} placeholderText={phText} index={index} isStacked={props.stacked}/>
              ))}
              {provided.placeholder}
            </div>
            {stackedPlaceholder.map((kek, index) => (
                <div key={kek.serialId} className='py-3 flex w-[100%] mx-auto rounded mb-3 outline-dashed -outline-offset-4 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-50'><p className='invisible'>+<br/>+</p></div>
            ))}
            
            {stackedItem.map((kek, index) => (
                <div key={kek.serialId} className='text-sm pl-2 pr-2 py-3 flex w-[100%] mx-auto rounded shadow-lg mb-3 -my-3 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-50'>{kek.name}</div>
            ))}
              

          </div>
    )}
    </Droppable>
  );
}
/** <div ref={setNodeRef} style={style} className={tailwindClass}>
      {props.children}
    </div>*/

export default ItemContainer;