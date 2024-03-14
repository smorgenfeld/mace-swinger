import React from 'react';
import CSS from 'csstype';
import {FC} from "react";
import Weapon from "./weapon";
import Dungeon from './dungeon'
import DungeonFloor from './dungeonFloor';
import parse from 'html-react-parser';
import Player from './player';

interface DungeonFloorContainer {
    parentFloor: DungeonFloor
}



const DungeonFloorContainer: FC<DungeonFloorContainer> = (props) => {

  function getStyle(color:string) {
    var output = "z-20 left-0 h-[1rem] mt-2 "
    if (props.parentFloor.isActive()) output += color //active
    else if (props.parentFloor.enemyNum == 0) output += "bg-slate-300 hidden" //finished
    else output += "bg-slate-800 hidden" //unfinished
    return output
  }

  function getActualStyle(cur: number, max: number) {
    const s: CSS.Properties = {
      'width': (cur/max*100).toFixed(0) + '%',
      'transition': "linear 0.1s",
    }
    return s
  }

  function getContainerStyle() {
    var containerStyle = 'z-20 left-0 w-auto p-2 mb-2 bg-slate-700 rounded-xl text-slate-300 text-sm'
    if (props.parentFloor.isActive()) {
      containerStyle += " h-[10rem]"
    }
    else {
      containerStyle += " h-[5rem]"
    }
    return containerStyle

  }
  
  function getActive() {
    if (props.parentFloor.isActive()) return "activeHitBar"
    else return ""
  }

  return (
    <div className={getContainerStyle()}>{props.parentFloor.enemyNum}/{props.parentFloor.maxEnemyNum} {props.parentFloor.enemy.name}: {Weapon.formatString(props.parentFloor.enemy.curhp, true)} hp
      <br/>
      Resists: {parse(props.parentFloor.enemy.getHTMLResists())} Deals: {parse(props.parentFloor.enemy.getHTMLDeals())}
      <div style={getActualStyle(props.parentFloor.enemy.curhp, props.parentFloor.enemy.maxhp)} className={getStyle("bg-green-500")}></div>
      <div style={getActualStyle(props.parentFloor.enemyNum,props.parentFloor.maxEnemyNum)} className={getStyle("bg-green-500")}></div>
      <div id={getActive()}></div>
      <div style={getActualStyle(Player.curPlayer.curhp,Player.curPlayer.maxhp)} className={getStyle("bg-red-500")}></div>
    </div>
  );
}

export default DungeonFloorContainer;