import Dungeon from "./dungeon"

class DungeonFloor {
    level: number
    maxhp: number
    curhp: number
    parentDungeon: Dungeon
    

    constructor(level: number, maxhp: number, parentDungeon: Dungeon) {
        this.level = level
        this.maxhp = maxhp
        this.curhp = maxhp
        this.parentDungeon = parentDungeon
    }

    dealDamage(toDeal: number) {
        this.curhp = Math.max(0,this.curhp-toDeal)
        if (this.curhp == 0) return true
        return false
    }

    isActive() {
        return this.level == this.parentDungeon.activeFloor
    }
}



export default DungeonFloor;