import DungeonFloor from "./dungeonFloor"

class Dungeon {
    name: string
    baseLevel: number
    activeFloor: number
    maxFloor: number
    floors: DungeonFloor[]
    
    static layerColors: string[] = ["bg-yellow-900", "bg-slate-800", "bg-slate-400", "bg-slate-900"]
    

    constructor(baseLevel: number) {
        this.name = "kek"
        this.baseLevel = baseLevel;
        this.activeFloor = 0;
        this.maxFloor = 10 * baseLevel

        this.floors = []
        for (let i = 0; i < this.maxFloor; i++) {
            this.floors.push(new DungeonFloor(i, this.getFloorHealth(i), this))
        }
    }

    getFloorHealth(floorLevel: number) {
        return Math.pow(1.25,floorLevel)*10
    }

    dealDamage(damage: number) {
        if (this.floors[this.activeFloor].dealDamage(damage)) this.activeFloor += 1;
    }
}



export default Dungeon;