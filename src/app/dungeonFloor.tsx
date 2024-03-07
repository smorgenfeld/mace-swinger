import Dungeon from "./dungeon"
import Enemy from "./enemy"
import DungeonArea from "./dungeonArea"

class DungeonFloor {
    level: number
    points: number
    parentDungeon: Dungeon
    parentArea: DungeonArea
    enemy: Enemy
    enemyNum: number
    maxEnemyNum: number
    

    constructor(level: number, points: number, parentDungeon: Dungeon, parentArea: DungeonArea, isBoss: boolean) {
        this.level = level
        this.points = points
        this.parentDungeon = parentDungeon
        this.parentArea = parentArea

        this.enemy = new Enemy(this, isBoss)

        this.enemyNum = Math.max(1, Math.round(this.points/this.enemy.maxhp))
        this.maxEnemyNum = this.enemyNum
    }

    dealDamage(toDeal: number[]) {
        this.enemy.dealDamage(toDeal)

        if (this.enemy.curhp <= 0) {
            this.enemy.curhp = 0
            this.enemyNum -= 1
            if (this.enemyNum == 0) return true
            this.enemy.curhp = this.enemy.maxhp
        }
        
        return false
    }

    isActive() {
        return this.level == this.parentDungeon.activeFloor
    }
}



export default DungeonFloor;