import Dungeon from "./dungeon"
import Enemy from "./enemy"
import DungeonArea from "./dungeonArea"
import Player from "./player"

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

        this.enemyNum = Math.round(Math.max(1, Math.round(this.points/this.enemy.maxhp) * this.parentArea.enemyNumMod))
        this.maxEnemyNum = this.enemyNum
    }

    takeDamage(toDeal: number[]) {
        this.enemy.takeDamage(toDeal)

        if (this.enemy.curhp <= 0) {
            this.enemy.curhp = 0
            this.enemyNum -= 1
            if (this.enemyNum == 0) {
                Player.curPlayer.addLoot(this.level+1)
                return true
            }
            this.enemy.curhp = this.enemy.maxhp
        }
        
        return false
    }

    dealDamage() {
        return this.enemy.dealDamage()
    }

    isActive() {
        return this.level == this.parentDungeon.activeFloor
    }

    reset() {
        this.enemy.fullheal()
        this.enemyNum = this.maxEnemyNum
    }
}



export default DungeonFloor;