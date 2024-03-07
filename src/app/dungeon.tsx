import DungeonFloor from "./dungeonFloor"
import DungeonArea from "./dungeonArea"

class Dungeon {
    name: string
    baseLevel: number
    activeFloor: number
    maxFloor: number
    floors: DungeonFloor[]
    areas: DungeonArea[]
    
    static layerColors: string[] = ["bg-yellow-900", "bg-slate-800", "bg-slate-400", "bg-slate-900"]
    

    constructor(baseLevel: number) {
        this.name = "kek"
        this.baseLevel = baseLevel;
        this.activeFloor = 0;
        this.maxFloor = 10 * baseLevel

        this.areas = []
        this.floors = []
        for (let i = 0; i < this.maxFloor; i++) {
            if (i % 10 == 0) {
                this.areas.push(new DungeonArea())
            }
            this.floors.push(new DungeonFloor(i, this.getFloorHealth(i), this, this.areas[this.areas.length-1], i % 10 === 9))
            
        }
    }

    getFloorHealth(floorLevel: number) {
        return Math.pow(1.25,floorLevel)*10
    }

    dealDamage(damage: number[]) {
        if (this.floors[this.activeFloor].dealDamage(damage)) this.activeFloor += 1;
    }
}



export default Dungeon;