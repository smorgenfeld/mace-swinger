import React from 'react';
import CSS from 'csstype';
import {FC} from "react";
import Weapon from './item';
import Dungeon from './dungeon'
import DungeonFloor from './dungeonFloor';

interface DungeonFloorContainer {
    parentFloor: DungeonFloor
}



const DungeonFloorContainer: FC<DungeonFloorContainer> = (props) => {

  function getStyle() {
    var output = "z-20 left-0 h-[25%] "
    if (props.parentFloor.isActive()) output += "bg-green-500" //active
    else if (props.parentFloor.enemyNum == 0) output += "bg-slate-300" //finished
    else output += "bg-slate-800" //unfinished
    return output
  }

  function getActualStyle(cur: number, max: number) {
    const s: CSS.Properties = {
      'width': (cur/max*100).toFixed(0) + '%',
    }
    return s
  }

  return (
    <div className='z-20 left-0 w-screen h-[10%]'>{props.parentFloor.enemyNum}/{props.parentFloor.maxEnemyNum} {props.parentFloor.enemy.name}: {(props.parentFloor.enemy.curhp).toFixed(0)} hp
      <div style={getActualStyle(props.parentFloor.enemy.curhp, props.parentFloor.enemy.maxhp)} className={getStyle()}></div>
      <div style={getActualStyle(props.parentFloor.enemyNum,props.parentFloor.maxEnemyNum)} className={getStyle()}></div>
    </div>
  );
}

export default DungeonFloorContainer;