import Weapon from "./weapon"
import Dungeon from "./dungeon"

class Player {
    name: string
    level: number
    curhp: number
    maxhp: number
    curWeapon: Weapon

    inv: Weapon[]
    loot: Weapon[]
    maxInvSize: number
    maxLootSize: number

    damResist: number[]

    static enemyHealthScale: number = 1.25
    static weaponDamageScale: number = 1.25
    static dungeonFloorPointScale: number = 1.25
    static curPlayer: Player


    constructor(name: string) {
        Player.curPlayer = this
        this.name = name
        this.level = 1

        this.maxhp = 100
        this.updateMaxHealth()
        this.curhp = this.maxhp

        this.damResist = [0,0,0,0]

        this.loot = [new Weapon(1,"newItems"),new Weapon(1,"newItems"),new Weapon(1,"newItems")]
        this.inv = [new Weapon(1,"invItems")]
        this.curWeapon = this.inv[0]
        this.maxInvSize = 3;
        this.maxLootSize = 10;
        
    }

    updateMaxHealth() {
        this.maxhp = 100
    }

    fullheal() {
        this.curhp = this.maxhp
    }

    heal(amount: number) {
        this.curhp = Math.min(this.maxhp,this.maxhp*amount+ this.curhp)
    }

    updateActiveWeapon() {
        this.curWeapon = this.inv[0]
    }

    takeDamage(toDeal: number[]) {
        var damDealt = 0
        for (let i = 0; i < this.damResist.length; i++) {
            damDealt += (1-this.damResist[i]) * toDeal[i]
        }
        this.curhp = Math.max(0,this.curhp-damDealt)
        if (this.curhp == 0) return true
        return false
    }

    escapeDungeon() {
        this.fullheal()
        Dungeon.curDungeon.reset()
    }

    addLoot(level: number) {
        const newWeapon = new Weapon(level,"newItems")
        if (this.loot.length < this.maxLootSize) {
            this.loot.push(newWeapon)
        }
        else {
            // delete bad weapons from loot pool
            var minValue = this.loot[0].value
            var minValueInd = 0
            for (let i = 1; i < this.loot.length; i++) {
                if (this.loot[i].value < minValue) {
                    minValueInd = i
                    minValue = this.loot[i].value
                }
            }

            if (newWeapon.value > minValue) {
                this.loot[minValueInd] = newWeapon
            }
        }
    }

    getHTMLResists() {
        const width = "w-[2.5rem]"

        var preoutput = ""
        var resists = false

        // handle damage resist breakdown
        for (let i = 0; i < this.damResist.length; i++) {
            if (this.damResist[i] > 0) {
                resists = true
                preoutput += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle ' + Weapon.damageColors[i] + " " + width + '">'
                preoutput += '<i class="bi margin:auto bi-' + Weapon.damageIcons[i] + '"></i><br> ' + Weapon.formatString(this.damResist[i], false) + " </span>"
            }
            //totDam += this.damage[i]
        }
        if (!resists) {
            preoutput += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle dark:bg-slate-500 dark:text-slate-300 ' + width + '">'
            preoutput += '<i class="bi margin:auto bi-x"></i><br>NA</span>'
        }
        return preoutput
    }

    getHTMLDeals() {
        const width = "w-[2.5rem]"

        var preoutput = ""
        var resists = false

        // handle damage output breakdown
        for (let i = 0; i < this.damResist.length; i++) {
            if (this.curWeapon.damage[i] > 0) {
                resists = true
                preoutput += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle ' + Weapon.damageColors[i] + " " + width + '">'
                preoutput += '<i class="bi margin:auto bi-' + Weapon.damageIcons[i] + '"></i><br> ' + Weapon.formatString(this.curWeapon.damage[i], false) + " </span>"
            }
            //totDam += this.damage[i]
        }
        if (!resists) {
            preoutput += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle dark:bg-slate-500 dark:text-slate-300 ' + width + '">'
            preoutput += '<i class="bi margin:auto bi-x"></i><br>NA</span>'
        }
        return preoutput
    }
}



export default Player;