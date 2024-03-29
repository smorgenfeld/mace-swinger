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
import Player from "./player";

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
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);
};

/**
 * Moves an item from one list to another list.
 */
const move = (source: Weapon[], dest: Weapon[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const [removed] = source.splice(droppableSource.index, 1);
  removed.curParId = droppableDestination.droppableId
  dest.splice(droppableDestination.index, 0, removed);
};

const windowShown = "z-10 block w-[100%] h-screen backdrop-blur	"
var timer: NodeJS.Timeout
var timerEnemy: NodeJS.Timeout
const delveButtonClass = "text-slate-950 dark:text-slate-50 font-bold rounded-xl absolute h-full bottom-0 mx-auto transition-all ease-out"
var delveButtonClassCur = delveButtonClass

const enemyHitButtonClass = "z-20 left-0 h-[1rem] mt-2 transition-all ease-out bg-yellow-500 "
var enemyHitButtonClassCur = enemyHitButtonClass



class App extends Component {

  state = {
      p: new Player("dipshit"),
      trashItems: [],
      windowsShown: [false, false, false],
      curSource: [false, false, false],
      delving: false,
      curDungeon: new Dungeon(3)
  };

  

  toggleWindows(ind: number) {
    var kek = this.state.windowsShown
    var curopen = -1
    if (kek[0]) { //if window currently open close it. if we don't do this page scrolls to top when switching between windows for some reason
      for (let i = 1; i < kek.length; i++) {
        if (kek[i]) {this.disableWindow(i); curopen = i; break}
      }
      kek = this.state.windowsShown
    }

    if (curopen != ind) {
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
        const body = document.body;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
      }
      else {
        console.log("fasdasdf")
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = '';
        body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }

      this.setState({windowsShown: kek})
    }
  }

  disableWindow(ind: number) {
    var kek = this.state.windowsShown
    kek[0] = false
    kek[ind] = false

    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    this.setState({windowsShown: kek})
  }

  toggleDelve() {
    var d = !this.state.delving
    
    const ss = (1/this.state.p.curWeapon.swingSpeed * 1000)
    const eSS = (1/this.state.curDungeon.getActiveEnemy().swingSpeed * 1000)
    if (d) {
      // set timeout to apply damage
      timer = setTimeout(this.swing.bind(this), ss);
      timerEnemy = setTimeout(this.enemySwing.bind(this), eSS);
      this.animateDelveButton(true, ss);
      this.animateEnemyHitButton(true, eSS);
    }
    else {
      clearInterval(timer)
      clearInterval(timerEnemy)
      this.animateDelveButton(false, ss);
      this.animateEnemyHitButton(false, eSS);
    }
    this.setState({delving: d})
  }


  swing() {
    if (this.state.delving) {
      // deal damage
      if (this.state.p.inv.length>0) this.state.curDungeon.takeDamage(this.state.p.curWeapon.damage)
      // call function again if still delving
      if (this.state.delving) {
        timer = setTimeout(this.swing.bind(this), 1/this.state.p.curWeapon.swingSpeed * 1000);
        this.animateDelveButton(true, 1/this.state.p.curWeapon.swingSpeed * 1000);
      }
      // update page state
      this.setState({curDungeon: this.state.curDungeon})
    }
  }

  enemySwing() {
    if (this.state.delving) {
      // deal damage to player
      if (this.state.curDungeon.dealDamage()) this.state.p.escapeDungeon()
      // call function again if still delving
      if (this.state.delving) {
        timer = setTimeout(this.enemySwing.bind(this), 1/this.state.curDungeon.getActiveEnemy().swingSpeed * 1000);
        this.animateEnemyHitButton(true, 1/this.state.curDungeon.getActiveEnemy().swingSpeed * 1000);
      }
      // update page state
      this.setState({curDungeon: this.state.curDungeon})
    }
  }

  animateDelveButton(way: boolean, duration: number) {
    if (way) {
      delveButtonClassCur = delveButtonClass + ' animate-load'
      var kek = document.getElementById("delveButton")
      if (kek!=null){
        kek.setAttribute("style", "animation-duration: " + duration.toFixed(0) +'ms;');
      }
    }
    else {
      delveButtonClassCur = delveButtonClass + ' w-0'
      var kek = document.getElementById("delveButton")
      if (kek!=null){
        kek.setAttribute("style", "");
      }
    }
  }

  animateEnemyHitButton(way: boolean, duration: number) {
    if (way) {
      enemyHitButtonClassCur = enemyHitButtonClass + ' animate-load'
      var kek = document.getElementById("activeHitBar")
      if (kek!=null){
        kek.setAttribute("style", "animation-duration: " + duration.toFixed(0) +'ms;');
        kek.setAttribute("className", enemyHitButtonClassCur)
      }
    }
    else {
      enemyHitButtonClassCur = enemyHitButtonClass + ' w-0'
      var kek = document.getElementById("activeHitBar")
      if (kek!=null){
        kek.setAttribute("style", "");
        kek.setAttribute("className", enemyHitButtonClassCur)
      }
    }
  }

  getList(id: Id) {
    if (id === 'newItems') return this.state.p.loot;
    else if (id === 'invItems') return this.state.p.inv;
    return this.state.trashItems;
  }

  updateListDOMs(){//id: string, input: Weapon[] | undefined) {
    this.state.p.updateActiveWeapon();
    this.setState({p: this.state.p})
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
      else if (destination.droppableId === 'trash' && this.state.p.inv.length <= 1) {
        //don't let player throw away weapon
        //janky animation so try to disable elsewhere too
        console.log('prevented last trashed weapon the janky way :(')
        return;
      }

      if (source.droppableId === destination.droppableId) {
        reorder(this.getList(source.droppableId), source.index, destination.index)
        this.updateListDOMs()

      } else {
        console.log(source.droppableId)
        console.log(destination.droppableId)
        move(this.getList(source.droppableId),this.getList(destination.droppableId),source,destination);
        this.updateListDOMs()

      }

      // reset delving to reset button animation and hopefully sync it with damage
      if (destination.droppableId === "invItems" || source.droppableId === "invItems") {
        this.animateDelveButton(false, 0);
      }
  };

  render() {
      return (
        <div className={this.state.windowsShown[0] ? "z-0 w-full flex justify-center"  :"z-0 w-full flex justify-center"}>
          <div className="fixed top-0 w-full">
            {/** quick inv bar idk not a huge fan tbh*/}
            <div className="z-0 bg-slate-800 dark:text-slate-50 py-2 px-4 fixed top-0 p-1 w-screen"><b>Loot:</b> {this.state.p.loot.length}  <b>Wood:</b> 0  <b>Stone:</b> 0 <b>Yeet</b> 0</div>

            {/** navigation buttons */ }
            <button className="z-20 bg-blue-500 text-slate-950 dark:text-slate-50 font-bold py-2 px-4 rounded-xl fixed bottom-6 right-[10%] h-[10%] w-[33%]" onClick={()=>this.toggleWindows(1)}>Loot</button>
            <button className="z-20 bg-green-500 text-slate-950 dark:text-slate-50 font-bold py-2 px-4 rounded-xl fixed bottom-6 left-[10%] h-[10%] w-[33%]" onClick={()=>this.toggleWindows(2)}>Inventory</button>

            {/** Loot, ind 0 */}
            <div className={this.state.windowsShown[1] ? windowShown : "hidden"}>
              <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <div className="p-0 space-y-3">
                  <ItemContainer p={this.state.p} items={this.state.p.loot} newId={"newItems"} title="Loot" maxSize={this.state.p.maxLootSize} isCurSource={this.state.curSource[1]} stacked={true}/>
                  <ItemContainer p={this.state.p} items={[]} newId={"trash"} title="Trash" maxSize={1} isCurSource={this.state.curSource[1]} stacked={false}/>
                  <ItemContainer p={this.state.p} items={this.state.p.inv} newId={"invItems"} title="Inventory" maxSize={this.state.p.maxInvSize} isCurSource={this.state.curSource[2]} stacked={false}/>
                </div>
              </DragDropContext>
           </div>

            {/** Inventory, ind 1 */}
            <div className={this.state.windowsShown[2] ? windowShown : "hidden"}>
              <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <div className="p-0 space-y-3">
                  <ItemContainer p={this.state.p} items={this.state.p.inv} newId={"invItems"} title="Inventory" maxSize={this.state.p.maxInvSize} isCurSource={this.state.curSource[2]} stacked={false} />
                  <ItemContainer p={this.state.p} items={[]} newId={"trash"} title="Trash" maxSize={1} isCurSource={this.state.curSource[1]} stacked={false}/>
                </div>
              </DragDropContext>
            </div>
          </div>
          
          {/** background */}
          <div className="-z-10 relative w-screen h-screen">
            <div className="relative w-screen -z-10 h-auto">
              <div className="relative -z-10 bg-sky-500 h-96 justify-center">
                <button className={"text-slate-950 dark:text-slate-50 font-bold py-2 rounded-xl absolute h-20 bottom-0 mx-auto bg-transparent w-40 -translate-x-1/2 left-1/2"} onClick={()=>this.toggleDelve()}>{this.state.delving ? "Delving..." : "Delve?"}
                  <div id="delveButton" className={delveButtonClassCur +" -z-20 bg-blue-500"}></div>
                  <div className={delveButtonClass +" -z-30 bg-blue-600 w-40 w-full"}></div>
                </button>
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
