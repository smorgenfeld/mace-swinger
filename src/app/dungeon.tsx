import DungeonFloor from "./dungeonFloor"
import DungeonArea from "./dungeonArea"
import Player from "./player"

class Dungeon {
    name: string
    baseLevel: number
    activeFloor: number
    maxFloor: number
    floors: DungeonFloor[]
    areas: DungeonArea[]
    
    static layerColors: string[] = ["bg-yellow-900", "bg-slate-800", "bg-slate-400", "bg-slate-900"]
    static curDungeon: Dungeon
    

    constructor(baseLevel: number) {
        Dungeon.curDungeon = this
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
        return Math.pow(Player.dungeonFloorPointScale,floorLevel)*10
    }

    //take damage from player
    takeDamage(damage: number[]) {
        if (this.floors[this.activeFloor].takeDamage(damage)) this.activeFloor += 1;
    }

    //deal damage to player
    dealDamage() {
        return this.floors[this.activeFloor].dealDamage()
    }

    getActiveEnemy() {
        return this.floors[this.activeFloor].enemy
    }

    reset() {
        for (let i = 0; i < this.maxFloor; i++) {
            this.floors[i].reset()
        }
        this.activeFloor = 0
    }
}



export default Dungeon;