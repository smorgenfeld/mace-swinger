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
    var output = "z-20 left-0 h-[10%] "
    if (props.parentFloor.isActive()) output += "bg-green-500" //active
    else if (props.parentFloor.curhp == 0) output += "bg-slate-300" //finished
    else output += "bg-slate-800" //unfinished
    return output
  }

  function getActualStyle() {
    const s: CSS.Properties = {
      'width': (props.parentFloor.curhp/props.parentFloor.maxhp*100).toFixed(0) + '%',
    }
    return s
  }

  return (
    <div style={getActualStyle()} className={getStyle()}>{(props.parentFloor.curhp).toFixed(0)}</div>
  );
}

export default DungeonFloorContainer;