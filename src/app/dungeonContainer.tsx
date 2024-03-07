import React from 'react';
import {FC} from "react";
import Dungeon from './dungeon'
import DungeonFloorContainer from './dungeonFloorContainer';

interface IDungeonContainer {
    parentDungeon: Dungeon,
}

const DungeonContainer: FC<IDungeonContainer> = (props) => {

    var areaHTML = []
    for (let i = 0; i < props.parentDungeon.baseLevel; i++) {
        areaHTML.push(Dungeon.layerColors[i] + " h-[" + (10*props.parentDungeon.baseLevel).toString()+"rem]" + " -z-10 p-2")
    }
    const height = "h-[" + (10*props.parentDungeon.baseLevel).toString()+"rem]"

    return (
        <div className="h-auto">
            {areaHTML.map((html, index) => (
            <div className={html} key={index}>
                <div className='z-20 left-0 w-auto p-2 mb-2 bg-slate-600 rounded-xl text-slate-300 text-m'><b>{props.parentDungeon.areas[index].name}</b></div>
                {props.parentDungeon.floors.slice(index*10, (index+1)*10).map((floor, index) => (
                <DungeonFloorContainer parentFloor={floor} key={index}/>
                ))}
            </div>
            ))}
                
        </div>
    );
}

export default DungeonContainer;