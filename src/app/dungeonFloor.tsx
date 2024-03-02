import Dungeon from "./dungeon"
import Enemy from "./enemy"

class DungeonFloor {
    level: number
    points: number
    parentDungeon: Dungeon
    enemy: Enemy
    enemyNum: number
    maxEnemyNum: number
    

    constructor(level: number, points: number, parentDungeon: Dungeon) {
        this.level = level
        this.points = points
        this.parentDungeon = parentDungeon

        this.enemy = new Enemy(this)

        this.enemyNum = Math.max(1, Math.round(this.points/this.enemy.maxhp))
        this.maxEnemyNum = this.enemyNum
    }

    dealDamage(toDeal: number) {
        this.enemy.curhp = Math.max(0,this.enemy.curhp-toDeal)
        if (this.enemy.curhp == 0) {
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