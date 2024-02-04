'use client'
import Image from "next/image";
import React from 'react';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {useState} from 'react';
import ItemDraggable from './draggable';
import ItemContainer from './droppable';
import Item from './item';
import Weapon from './weapon';
import dynamic from "next/dynamic";

/*

export default function App() {
  const [horzSlider] = useKeenSlider<HTMLDivElement>({
    slides: {
      origin: "center",
    },
    selector: ".first > .keen-slider__slide",
    initial: 1,
  })


  const [vertSlider] = useKeenSlider<HTMLDivElement>({
    rubberband: false,
    slides: {
      perView: 1,
      origin: "center",
    },
    vertical: true,
    initial: 1,
  })

  const [isDropped, setIsDropped] = React.useState(false);
  const draggableMarkup = (
    <Draggable>Drag me</Draggable>
  );

  function handleDragEnd(event) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }

  return (
    <div ref={horzSlider} className="keen-slider first">
      <div className="keen-slider__slide number-slide1">BASE UPGRADE</div>
      <div className="keen-slider__slide number-slide2">
        <div
          ref={vertSlider}
          className="keen-slider"
          style={{ width: "100%", height: "100vh" }}
        >
          <div className="keen-slider__slide number-slide1">MAP</div>
          <div className="keen-slider__slide number-slide2">BASE</div>
          <div className="keen-slider__slide number-slide3">DUNGEON</div>
        </div>
      </div>
      <div className="keen-slider__slide number-slide4">INVENTORY
      <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : null}
      <Droppable>
        {isDropped ? draggableMarkup : 'Drop here'}
      </Droppable>
    </DndContext>
      </div>
    </div>
  )
}
*/
class Container {
  id: string;
  itemList : Item[];
  updateFunc : React.Dispatch<React.SetStateAction<Item[]>>

  constructor(newId: string, newItemList: Item[], newUpdateFunc: React.Dispatch<React.SetStateAction<Item[]>>) {
    this.id = newId;
    this.itemList = newItemList;
    this.updateFunc = newUpdateFunc
  }

}

const App = () => {
  const [isDropped, setIsDropped] = React.useState(false);


  const [newItems, setNewItems] = useState<Item[]>([
    new Weapon(1, "droppable-newItems"),
    new Weapon(1, "droppable-newItems"),
    new Weapon(1, "droppable-newItems"),
    new Weapon(1, "droppable-newItems"),
    new Weapon(1, "droppable-newItems"),
    new Weapon(1, "droppable-newItems"),
    new Weapon(2, "droppable-newItems")
  ]);
  const newItemContainer = new Container("droppable-newItems", newItems, setNewItems);

  const [invItems, setInvItems] = useState<Item[]>([]);
  const invItemContainer = new Container("droppable-invItems", invItems, setInvItems);

  const [trashItems, setTrashItems] = useState<Item[]>([]);
  const trashItemContainer = new Container("droppable-trash", trashItems, setTrashItems);

  const id = React.useId();

  const itemContainers = [newItemContainer, invItemContainer, trashItemContainer]

  const addToInventory = (e: DragEndEvent) => {
    /** if current data undefined then exit, otherwise set newItem to dragged element's item object */
    if (!e.active.data.current) return;
    const newItem = e.active.data.current.item;

    /** do nothing if the item is dropped into its parent container */
    if (e.over?.id === newItem.curParId) return;

    for (let i = 0; i < itemContainers.length; i++) {
      if (e.over?.id === itemContainers[i].id) {
        /** remove item from old container's list of items */
        for (let j = 0; j < itemContainers.length; j++) {
          if (newItem.curParId === itemContainers[j].id) {

            var ind = -1
            for (let k = 0; k < itemContainers[j].itemList.length; k++) {
              if (itemContainers[j].itemList[k].serialId === newItem.serialId) {
                ind = k;
                break;
              }
            }
            if (ind !== -1) {
              itemContainers[j].itemList.splice(ind, 1)
              itemContainers[j].updateFunc(itemContainers[j].itemList)
            }
            break;
          }
        }
        /** add item to new container's list of items, unless it's trash */
        if (e.over?.id !== "droppable-trash") {
          itemContainers[i].itemList.push(newItem)
          itemContainers[i].updateFunc(itemContainers[i].itemList)
        }

        newItem.curParId = e.over?.id
        
        break;
      }
    }
/**
    if (e.over?.id === "droppable-inventory") {
      const invItemsCopy = [...invItems];
      invItemsCopy.push(newItem);
      setInvItems(invItemsCopy);

      const newItemsCopy = [...newItems];
      const ind = newItemsCopy.indexOf(newItem)
      if (ind !== -1) {
        newItemsCopy.splice(ind, 1)
        setNewItems(newItemsCopy);
      }
      

    }
    else if (e.over?.id === "droppable-newItems") {

    }
    else if (e.over?.id === "droppable-trash") {
      
    }
    */
    
  }

  return (
    <DndContext id={id} onDragEnd={addToInventory}>
      <div className="p-6">
        <ItemContainer items={newItems} newId={"newItems"} title="Loot" />
        <ItemContainer items={invItems} newId={"invItems"} title="Inventory" />
        <ItemContainer items={[]} newId={"trash"} title="" />
      </div>
    </DndContext>
  
    

  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});