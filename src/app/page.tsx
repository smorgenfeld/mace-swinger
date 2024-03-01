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
import Dungeon from './dungeon';
import 'bootstrap-icons/font/bootstrap-icons.css'
import DungeonContainer from "./dungeonContainer";

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
    output.push(new Weapon(1+Math.floor(Math.random() * (10+1)), ""))
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

const windowShown = "z-10 block w-[100%] h-screen backdrop-blur	"

class App extends Component {

  state = {
      newItems: getItems(25),
      invItems: getItems(3, 25),
      trashItems: [],
      windowsShown: [false, false, false],
      curSource: [false, false, false],
      maxInvSize: [3, 10], // inven, loot pool
      delving: false,
      curDungeon: new Dungeon(3)
  };
  

  toggleWindows(ind: number) {
    var kek = this.state.windowsShown
    for (let i = 0; i < kek.length; i++) {
      if (i != ind) kek[i] = false;
      else {
        kek[i] = !kek[i]
        kek[0] = kek[i]
      }
    }

    // lock scrolling when modal is open
    // thank jesus for this random article https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
    if (kek[ind]) {
      const scrollY = window.scrollY
      console.log(scrollY)
      const body = document.body;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
    }
    else {
      const body = document.body;
      const scrollY = body.style.top;
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    this.setState({windowsShown: kek})
  }

  toggleDelve() {
    var d = !this.state.delving
    this.setState({delving: d})
    if (this.state.invItems.length>0) this.state.curDungeon.dealDamage(Math.max(...this.state.invItems[0].damage))
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
    var kek = this.state.curSource
    for (let i=0; i < kek.length; i++) {
      kek[i] = false
    }
    if (start.source.droppableId === "newItems") {kek[1] = true; kek[0] = true} //first index holds whether any window is open and bg should be blurred
    else if (start.source.droppableId === "invItems") {kek[2] = true; kek[0] = true}

    this.setState({curSource: kek})
  }

  onDragEnd = (result: DropResult) => {
      const { source, destination } = result;

      // reset curSource list so we redisable any full droppables
      var kek = this.state.curSource
      for (let i=0; i < kek.length; i++) {
        kek[i] = false
      }
      this.setState({curSource: kek})

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

          
          this.updateList(destination.droppableId, result.get(destination.droppableId))
          this.updateList(source.droppableId, result.get(source.droppableId))

      }
  };

  render() {
      return (
        <div className={this.state.windowsShown[0] ? "z-0 w-full flex justify-center"  :"z-0 w-full flex justify-center"}>
          <div className="fixed top-0 w-full">
            {/** quick inv bar idk not a huge fan tbh*/}
            <div className="z-0 bg-slate-800 dark:text-slate-50 py-2 px-4 fixed top-0 p-1 w-screen"><b>Loot:</b> {this.state.newItems.length}  <b>Wood:</b> 0  <b>Stone:</b> 0 <b>Yeet</b> 0</div>

            {/** navigation buttons */ }
            <button className="z-20 bg-blue-500 text-slate-950 dark:text-slate-50 font-bold py-2 px-4 rounded-xl fixed bottom-6 right-[10%] h-[10%] w-[33%]" onClick={()=>this.toggleWindows(1)}>Loot</button>
            <button className="z-20 bg-green-500 text-slate-950 dark:text-slate-50 font-bold py-2 px-4 rounded-xl fixed bottom-6 left-[10%] h-[10%] w-[33%]" onClick={()=>this.toggleWindows(2)}>Inventory</button>

            {/** Loot, ind 0 */}
            <div className={this.state.windowsShown[1] ? windowShown : "hidden"}>
              <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <div className="p-0 space-y-3">
                  <ItemContainer items={this.state.newItems} newId={"newItems"} title="Loot" maxSize={this.state.maxInvSize[1]} isCurSource={this.state.curSource[1]} stacked={true}/>
                  <ItemContainer items={[]} newId={"trash"} title="Trash" maxSize={1} isCurSource={this.state.curSource[1]} stacked={false}/>
                  <ItemContainer items={this.state.invItems} newId={"invItems"} title="Inventory" maxSize={this.state.maxInvSize[0]} isCurSource={this.state.curSource[2]} stacked={false}/>
                </div>
              </DragDropContext>
           </div>

            {/** Inventory, ind 1 */}
            <div className={this.state.windowsShown[2] ? windowShown : "hidden"}>
              <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <div className="p-0 space-y-3">
                  <ItemContainer items={this.state.invItems} newId={"invItems"} title="Inventory" maxSize={this.state.maxInvSize[0]} isCurSource={this.state.curSource[2]} stacked={false} />
                  <ItemContainer items={[]} newId={"trash"} title="Trash" maxSize={1} isCurSource={this.state.curSource[1]} stacked={false}/>
                </div>
              </DragDropContext>
            </div>
          </div>
          
          {/** background */}
          <div className="-z-10 relative w-screen h-screen">
            <div className="relative w-screen -z-10 h-auto">
              <div className="relative -z-10 bg-sky-500 h-96 justify-center">
                <button className="z-10 bg-blue-500 text-slate-950 dark:text-slate-50 font-bold py-2 px-4 rounded-xl absolute h-20 w-40 bottom-0 mx-auto -translate-x-1/2 left-1/2" onClick={()=>this.toggleDelve()}>{this.state.delving ? "Delving..." : "Delve?"}</button>
              </div>
              <DungeonContainer parentDungeon={this.state.curDungeon}></DungeonContainer>
            </div>
          </div>

        </div>
      );
  }
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
