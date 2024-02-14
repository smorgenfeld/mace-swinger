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

const itemTailwindClass = "p-6 flex shrink-0 max-w-sm mx-auto rounded-xl shadow-lg bg-slate-200"

class App extends Component {
  state = {
      newItems: getItems(5),
      invItems: getItems(5, 5),
      trashItems: []
  };

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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
      return (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="p-6">
              <ItemContainer items={this.state.newItems} newId={"newItems"} title="Loot" />
              <ItemContainer items={this.state.invItems} newId={"invItems"} title="Inventory" />
              <ItemContainer items={[]} newId={"trash"} title="Trash" />
            </div>
          </DragDropContext>
      );
  }
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
