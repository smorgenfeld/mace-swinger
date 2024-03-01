import React from 'react';
import {FC} from "react";
import Dungeon from './dungeon'
import DungeonFloorContainer from './dungeonFloorContainer';

interface IDungeonContainer {
    parentDungeon: Dungeon,
}

const DungeonContainer: FC<IDungeonContainer> = (props) => {

    var areas = []
    for (let i = 0; i < props.parentDungeon.baseLevel; i++) {
        areas.push(Dungeon.layerColors[i] + " h-96 -z-10")
    }
    const height = "h-[" + (96*props.parentDungeon.baseLevel).toString()+"px]"

    return (
        <div className="h-auto">
            {areas.map((area, index) => (
            <div className={area} key={index}>
                {props.parentDungeon.floors.slice(index*10, (index+1)*10).map((floor, index) => (
                <DungeonFloorContainer parentFloor={floor} key={index}/>
                ))}
            </div>
            ))}
                
        </div>
    );
}

export default DungeonContainer;