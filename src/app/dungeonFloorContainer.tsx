import React from 'react';
import CSS from 'csstype';
import {FC} from "react";
import Weapon from "./weapon";
import Dungeon from './dungeon'
import DungeonFloor from './dungeonFloor';
import parse from 'html-react-parser';

interface DungeonFloorContainer {
    parentFloor: DungeonFloor
}



const DungeonFloorContainer: FC<DungeonFloorContainer> = (props) => {

  function getStyle() {
    var output = "z-20 left-0 h-[0.5rem] "
    if (props.parentFloor.isActive()) output += "bg-green-500" //active
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

  return (
    <div className='z-20 left-0 w-auto h-[5rem] p-2 mb-2 bg-slate-700 rounded-xl text-slate-300 text-sm'>{props.parentFloor.enemyNum}/{props.parentFloor.maxEnemyNum} {props.parentFloor.enemy.name}: {Weapon.formatString(props.parentFloor.enemy.curhp, true)} hp
      <br/>
      Resists: {parse(props.parentFloor.enemy.getHTMLResists())} Deals: {parse(props.parentFloor.enemy.getHTMLDeals())}
      <div style={getActualStyle(props.parentFloor.enemy.curhp, props.parentFloor.enemy.maxhp)} className={getStyle()}></div>
      <div style={getActualStyle(props.parentFloor.enemyNum,props.parentFloor.maxEnemyNum)} className={getStyle()}></div>
    </div>
  );
}

export default DungeonFloorContainer;