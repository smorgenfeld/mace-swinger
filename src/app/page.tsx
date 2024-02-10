'use client'
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {useState} from 'react';
import ItemDraggable from './draggable';
import ItemContainer from './droppable';
import Item from './item';
import Weapon from './weapon';
import dynamic from "next/dynamic";

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable, Id, OnDragEndResponder, DropResult, DraggableLocation, DraggableStyle } from '@hello-pangea/dnd';

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

/*
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
    /** if current data undefined then exit, otherwise set newItem to dragged element's item object 
    if (!e.active.data.current) return;
    const newItem = e.active.data.current.item;

    /** do nothing if the item is dropped into its parent container 
    if (e.over?.id === newItem.curParId) return;

    for (let i = 0; i < itemContainers.length; i++) {
      if (e.over?.id === itemContainers[i].id) {
        /** remove item from old container's list of items 
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
        /** add item to new container's list of items, unless it's trash 
        if (e.over?.id !== "droppable-trash") {
          itemContainers[i].itemList.push(newItem)
          itemContainers[i].updateFunc(itemContainers[i].itemList)
        }

        newItem.curParId = e.over?.id
        
        break;
      }
    }   
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
*/

const menu = {
  width: '35px',
  height: '5px',
  backgroundColor: 'black',
  margin: '6px 0'
};
// fake data generator
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `item-${k + offset}`,
      content: `item ${k + offset}`
  }));

// a little function to help us with reordering the result
const reorder = (list: {id: string, content: string}[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source: {id: string, content: string}[], destination: {id: string, content: string}[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: Map<string, {id: string, content: string}[]> = new Map();
  result.set(droppableSource.droppableId, sourceClone)
  result.set(droppableDestination.droppableId, destClone)

  return result;
};

const grid = 8;

var tailwindClass = "p-6 flex shrink-0 max-w-sm mx-auto rounded-xl shadow-lg"

const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

class App extends Component {
  state = {
      items: getItems(5),
      selected: getItems(5, 5)
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
      droppable: 'items',
      droppable2: 'selected'
  };

  getList(id: Id) {
    if (id === 'droppable') return this.state.items;
    return this.state.selected;
  }

  onDragEnd = (result: DropResult) => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
          return;
      }

      if (source.droppableId === destination.droppableId) {
          const items = reorder(
              this.getList(source.droppableId),
              source.index,
              destination.index
          );

          let state = { items };

          if (source.droppableId === 'droppable2') {
              state = { selected: items };
          }

          this.setState(state);
      } else {
          const result = move(
              this.getList(source.droppableId),
              this.getList(destination.droppableId),
              source,
              destination
          );

          this.setState({
              items: result.get("droppable"),
              selected: result.get("droppable2"),
          });
      }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
      return (
          <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.items.length > 0 &&
                              this.state.items.map((item, index) => (
                                  <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}>
                                      {(provided, snapshot) => (
                                          <div>
                                              <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className="tailwindClass">
                                                  <div
                                                      style={{
                                                          float: 'right',
                                                          marginTop: '-9px'
                                                      }}>
                                                      <div style={menu} />
                                                      <div style={menu} />
                                                      <div style={menu} />
                                                  </div>
                                                  {item.content}
                                              </div>
                                          </div>
                                      )}
                                  </Draggable>
                              ))}
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable>
              <Droppable droppableId="droppable2">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.selected.map((item, index) => (
                              <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}>
                                  {(provided, snapshot) => (
                                      <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="tailwindClass">
                                          <div
                                              style={{
                                                  float: 'right',
                                                  marginTop: '-9px'
                                              }}>
                                              <div style={menu} />
                                              <div style={menu} />
                                              <div style={menu} />
                                          </div>
                                          {item.content}
                                      </div>
                                  )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable>
          </DragDropContext>
      );
  }
}

// Put the things into the DOM!
/**ReactDOM.render(<App />, document.getElementById('root'));*/

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
