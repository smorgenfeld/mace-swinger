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
import { DragDropContext, Droppable, Draggable, Id, OnDragEndResponder, DropResult, DraggableLocation, DraggableStyle, DragStart } from '@hello-pangea/dnd';

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

/* ripped from https://codesandbox.io/p/sandbox/multiple-lists-with-drag-and-drop-zvdfe?file=%2Findex.js%3A40%2C1 */

// fake data generator
function getItems(count: number, offset = 0) {
  const output = [];
  for (let i = 0; i < count; i++) {
    output.push(new Weapon(1, ""))
  }
  return output;
}
  

// a little function to help us with reordering the result
const reorder = (list: Weapon[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source: Weapon[], destination: Weapon[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: Map<string, Weapon[]> = new Map();
  result.set(droppableSource.droppableId, sourceClone)
  result.set(droppableDestination.droppableId, destClone)

  return result;
};

const windowShown = "z-10 block w-[100%] bg-slate-400 h-full rounded-xl"

class App extends Component {
  state = {
      newItems: getItems(5),
      invItems: getItems(5, 5),
      trashItems: [],
      windowsShown: [false, false],
      curSource: [false, false],
      maxInvSize: 5
  };

  toggleWindows(ind: number) {
    for (let i = 0; i < this.state.windowsShown.length; i++) {
      if (i != ind) this.state.windowsShown[i] = false;
      else {
        this.state.windowsShown[i] = !this.state.windowsShown[i]
      }
    }
    this.setState({windowsShown: this.state.windowsShown})
  }

  getList(id: Id) {
    if (id === 'newItems') return this.state.newItems;
    else if (id === 'invItems') return this.state.invItems
    return this.state.trashItems;
  }

  updateList(id: string, input: Weapon[] | undefined) {
    if (input!=undefined) {
      if (id === "newItems") this.setState({newItems: input})
      else if (id === "invItems") this.setState({invItems: input})
    }
  }

  onDragStart = (start: DragStart) => {
    // if a droppable is a drag source renable if full so we can reorder full droppables
    for (let i=0; i < this.state.curSource.length; i++) {
      this.state.curSource[i] = false
    }
    if (start.source.droppableId === "newItems") this.state.curSource[0] = true
    else if (start.source.droppableId === "invItems") this.state.curSource[1] = true

    this.setState({curSource: this.state.curSource})
  }

  onDragEnd = (result: DropResult) => {
      const { source, destination } = result;

      // reset curSource list so we redisable any full droppables
      for (let i=0; i < this.state.curSource.length; i++) {
        this.state.curSource[i] = false
      }
      this.setState({curSource: this.state.curSource})

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

          this.updateList(source.droppableId, items)

      } else {
        console.log(source.droppableId)
        console.log(destination.droppableId)
          const result = move(
              this.getList(source.droppableId),
              this.getList(destination.droppableId),
              source,
              destination
          );

          this.updateList(source.droppableId, result.get(source.droppableId))
          this.updateList(destination.droppableId, result.get(destination.droppableId))

      }
  };

  render() {
      return (
        <div className="z-0 p-5 w-full h-full flex justify-center">
          <button className="z-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl fixed bottom-3 right-[10%] h-[10%] w-[25%]" onClick={()=>this.toggleWindows(0)}>Loot</button>
          <button className="z-20 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl fixed bottom-3 left-[10%] h-[10%] w-[25%]" onClick={()=>this.toggleWindows(1)}>Inventory</button>

          {/** Loot, ind 0 */}
          <div className={this.state.windowsShown[0] ? windowShown : "hidden"}>
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
              <div className="p-6 space-y-6">
                <ItemContainer items={this.state.newItems} newId={"newItems"} title="Loot" maxSize={this.state.maxInvSize} isCurSource={this.state.curSource[0]} />
                <ItemContainer items={this.state.invItems} newId={"invItems"} title="Inventory" maxSize={this.state.maxInvSize} isCurSource={this.state.curSource[1]}/>
                <ItemContainer items={[]} newId={"trash"} title="Trash" maxSize={1} isCurSource={this.state.curSource[0]}/>
              </div>
            </DragDropContext>
          </div>

          {/** Inventory, ind 1 */}
          <div className={this.state.windowsShown[1] ? windowShown : "hidden"}>
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
              <div className="p-6 space-y-6">
                <ItemContainer items={this.state.invItems} newId={"invItems"} title="Inventory" maxSize={this.state.maxInvSize} isCurSource={this.state.curSource[1]} />
                <ItemContainer items={[]} newId={"trash"} title="Trash" maxSize={1} isCurSource={this.state.curSource[0]}/>
              </div>
            </DragDropContext>
          </div>
          </div>
      );
  }
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
