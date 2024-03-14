import DungeonFloor from "./dungeonFloor"
import DungeonArea from "./dungeonArea";
import Weapon from "./weapon";
import Player from "./player";

class EnemyType {
    name: string;
    baseDamResist: number[];
    baseDamOutput: number[];
    baseHP: number;
    baseHitspeed: number

    constructor(name: string, baseHP: number, baseDamResist: number[], baseDamOutput: number[], baseHitspeed: number) {
        this.name = name
        this.baseDamResist = baseDamResist;
        this.baseHP = baseHP;
        this.baseDamOutput = baseDamOutput;
        this.baseHitspeed = baseHitspeed;
    }
}

class EnemyPrefix {
    name: string;
    modDamResist: number[];
    modDamOutput: number[];
    modHP: number;

    constructor(name: string, modHP: number, modDamResist: number[], modDamOutput: number[]) {
        this.name = name
        this.modDamResist = modDamResist;
        this.modHP = modHP;
        this.modDamOutput = modDamOutput;
    }
}

class Enemy {
    level: number
    maxhp: number
    curhp: number
    name: string
    type: EnemyType
    prefix: EnemyPrefix[]
    damResist: number[]
    damOutput: number[]
    swingSpeed: number

    parentDungeonFloor: DungeonFloor

    //sharp, blunt, magic/radiation, explosive
    //name, basehp, baseDamResist (additive), baseDamOutput (multiplicative, dps), basehitspeed (hits/sec)
    static enemyTypes:  {[key: string]: EnemyType} = {
        "Rat":          new EnemyType("Rat",                1,   [0.0, 0.0, 0.0, 0.0],  [1,  0,  0,  0], 3),

        "Spider":          new EnemyType("Spider",          2,   [0.0, 0.0, 0.0, 0.0],  [2,  0,  0,  0], 2),

        "Skeleton":     new EnemyType("Skeleton",           5,   [0.2, 0.0, 0.5, 0.0],  [0, 5, 0,  0], 1.2),
        "Zombie":       new EnemyType("Zombie",             5,   [0.0, 0.0, 0.5, 0.0],  [5, 0, 0,  0], 0.5),
        "Ghost":        new EnemyType("Ghost",              5,   [0.9, 0.9, 0.9, 0.9],  [0, 0, 0,  0], 1),
        "Lich":         new EnemyType("Lich",               30,   [0.2, 0.2, 0.5, 0.0],  [10, 0, 0,  0], 1),
        "Wight":         new EnemyType("Wight",             30,   [0.2, 0.2, 0.5, 0.0],  [0, 10, 0,  0], 1),

        "Goblin":       new EnemyType("Goblin",             5,   [0.0, 0.0, 0.0, 0.0],  [5, 0, 0,  0], 1.2),
        "Bat":          new EnemyType("Bat",                2,   [0.9, 0.9, 0.9, 0.0],  [1, 0, 0,  0], 1),
        "Bear":         new EnemyType("Bear",               15,  [0.0, 0.0, 0.0, 0.0],  [0, 10, 0,  0], 0.7),
        "Troll":        new EnemyType("Troll",              20,  [0.3, 0.0, 0.0, 0.0],  [0, 10, 0,  0], 0.3),

        "Cheesemonger": new EnemyType("Cheesemonger",       10,  [0.0, 0.0, 0.0, 0.0],  [0, 10, 0,  0], 1),
        "Minstrel":     new EnemyType("Minstrel",           1,   [0.0, 0.0, 0.0, 0.0],  [0, 1, 0,  0], 1.5),
        "Drunkard":     new EnemyType("Drunkard",           5,   [0.0, 0.0, 0.0, 0.0],  [0, 3, 0,  0], 0.5),
        "Mayor":        new EnemyType("Mayor",              20,  [0.0, 0.0, 0.0, 0.0],  [0, 1, 0,  0], 1),

        "Miner":        new EnemyType("Miner",              5,   [0.0, 0.5, 0.0, 0.5],   [5, 0, 0,  0], 0.5),
        "Minor":        new EnemyType("Minor",              2,   [0.0, 0.0, 0.0, 0.0],   [0, 1, 0,  0], 1),
        "Geologist":    new EnemyType("Geologist",          20,  [0.0, 0.0, 0.0, 0.0],   [0, 10, 0,  0], 1),

        "Barista":      new EnemyType("Barista",            5,   [0.0, 0.0, 0.0, 0.0],  [0, 10, 0,  0], 3),
        "Astrologist":  new EnemyType("Astrologist",        2,   [0.0, 0.0, 0.0, 0.0],  [0, 5, 0,  0], 1),

        "Safety Inspector":  new EnemyType("Safety Inspector",        10,   [0.2, 0.2, 0.2, 0.2],  [0, 5, 0,  0], 1),
        "Torch Repairman":  new EnemyType("Torch Repairman",        10,   [0.2, 0.2, 0.2, 0.2],  [0, 5, 0,  0], 1),
        
    }

    static enemyPrefixArmor: EnemyPrefix[] = [
        new EnemyPrefix("Padded",           1,   [0.0, 0.5, 0.0, 0.5],  [1,  1,  1,  1]),
        new EnemyPrefix("Lead-lined",       1,   [0.0, 0.0, 0.5, 0.0],  [1,  1,  1,  1]),
        new EnemyPrefix("Armored",          1,   [0.6, 0.1, 0.0, 0.2],  [1,  1,  1,  1]),
        new EnemyPrefix("Scaled",           1,   [0.5, 0.0, 0.0, 0.0],  [1,  1,  1,  1]),
        new EnemyPrefix("Naked",            1,   [-0.5, -0.5, 0.0, -0.5],  [1,  1,  1,  1]),
        new EnemyPrefix("Warded",           1,   [0.5, 0.5, 0.5, 0.5],  [1,  1,  1,  1]),
        new EnemyPrefix("Shielded",         1,   [0.5, 0.2, 0.0, 0.2],  [1,  1,  1,  1]),
    ]

    static enemyPrefixAttribute: EnemyPrefix[] = [
        new EnemyPrefix("Small",            0.5,   [0.0, 0.0, 0.0, 0.0],  [0.5,  0.5,  0.5,  0.5]),
        new EnemyPrefix("Tiny",             0.25,  [0.0, 0.0, 0.0, 0.0],  [0.25,  0.25,  0.25,  0.25]),
        new EnemyPrefix("Tall",             1.25,  [0.0, 0.0, 0.0, 0.0],  [1.25,  1.25,  1.25,  1.25]),
        new EnemyPrefix("Rotund",           1.5,     [0.0, 0.0, 0.0, 0.0],  [1,  1,  1,  1]),
        new EnemyPrefix("Musclebound",      1.5,   [0.0, 0.2, 0.0, 0.0],  [1.25,  1.25,  1,  1]),
        new EnemyPrefix("Scrawny",          0.5,   [0.0, 0.0, 0.0, 0.0],  [0.75,  0.75,  1,  1]),
        new EnemyPrefix("Giant",            2,    [0.0, 0.0, 0.0, 0.0],  [1,  1,  1,  1]),
        new EnemyPrefix("Wide",             1.3,    [0.0, 0.0, 0.0, 0.0],  [1,  1,  1,  1]),
    ]

    static enemyPrefixState: EnemyPrefix[] = [
        new EnemyPrefix("Drunk", 1, [0.0, 0.0, 0.0, 0.0], [0.5,  0.5,  0.5,  0.5]),
        new EnemyPrefix("Depressed", 1, [0.0, 0.0, 0.0, 0.0], [0.5,  0.5,  1.0,  1.0]),
        new EnemyPrefix("Sleepy", 1, [-0.1, -0.1, 0.0, 0.0], [0.5,  0.5,  0.5,  0.5]),
        new EnemyPrefix("Bedridden", 1, [-0.3, -0.3, 0.0, 0.0], [0.2,  0.2,  0.5,  0.5]),
        new EnemyPrefix("Paranoid", 1, [0.1, 0.1, 0.5, 0.0], [1,  1,  1,  1]),
        new EnemyPrefix("Hangry", 1, [0.0, 0.0, 0.0, 0.0], [1.5,  1.5,  1.5,  1.5]),
        new EnemyPrefix("Frenzied", 1,   [0.0, 0.0, 0.0, 0.0], [1.2,  1.2,  1.2,  1.2]),
    ]

    static enemyPrefixJoke: EnemyPrefix[] = [
        new EnemyPrefix("Generic", 1, [0.0, 0.0, 0.0, 0.0], [1, 1, 1, 1]),
        new EnemyPrefix("Opaque",  1, [0.0, 0.0, 0.0, 0.0], [1, 1, 1, 1]),
        new EnemyPrefix("Common",  1, [0.0, 0.0, 0.0, 0.0], [1, 1, 1, 1]),
        new EnemyPrefix("Ordinary",  1, [0.0, 0.0, 0.0, 0.0], [1, 1, 1, 1]),
        new EnemyPrefix("Ununusual",  1, [0.0, 0.0, 0.0, 0.0], [1, 1, 1, 1]),
        new EnemyPrefix("Blind",  1, [0.0, 0.0, 0.0, 0.0], [0.1, 0.1, 0.1, 0.1]),
        new EnemyPrefix("Passive",  1, [0.0, 0.0, 0.0, 0.0], [0, 0, 0, 0]),
        new EnemyPrefix("Gullible",  1, [-0.5, -0.5, -0.5, -0.5], [1, 1, 1, 1]),
        new EnemyPrefix("Credulous",  1, [-1, -1, -1, -1], [1, 1, 1, 1]),
    ]
    

    constructor(parentDungeonFloor: DungeonFloor, isBoss: boolean) {
        this.level = parentDungeonFloor.level
        
        this.parentDungeonFloor = parentDungeonFloor
        
        if (isBoss) this.type = Enemy.enemyTypes[Weapon.randItem(this.parentDungeonFloor.parentArea.bossTypes)]
        else this.type = Enemy.enemyTypes[Weapon.randItem(this.parentDungeonFloor.parentArea.allowedList)]

        this.maxhp = this.type.baseHP * Math.pow(Player.enemyHealthScale,this.level) / Math.max(1,this.parentDungeonFloor.parentArea.enemyNumMod)

        const randNum = Weapon.randInt(9)
        if (randNum <= 3) this.prefix = [Weapon.randItem(Enemy.enemyPrefixArmor)];
        else if (randNum <= 6) this.prefix = [Weapon.randItem(Enemy.enemyPrefixAttribute)];
        else if (randNum <= 7) this.prefix = [Weapon.randItem(Enemy.enemyPrefixState)];
        else if (randNum <= 8) this.prefix = [Weapon.randItem(Enemy.enemyPrefixJoke)];
        else {
            this.prefix = [Weapon.randItem(Enemy.enemyPrefixArmor), Weapon.randItem(Enemy.enemyPrefixAttribute)]
        }

        this.damResist = [...this.type.baseDamResist]
        this.damOutput = [...this.type.baseDamOutput]
        this.swingSpeed = this.type.baseHitspeed

        this.name = this.type.name
        for (let i = 0; i < this.prefix.length; i++) {
            this.name = this.prefix[i].name + " "
            this.maxhp *= this.prefix[i].modHP
            for (let j = 0; j < this.damResist.length; j++) {
                this.damResist[j] = Math.max(0,Math.min(0.9, this.damResist[j] + this.prefix[i].modDamResist[j]))
                this.damOutput[j] *= this.prefix[i].modDamOutput[j]
            }
        }

        //mod damage with hitspeed
        for (let j = 0; j < this.damOutput.length; j++) {
            this.damOutput[j] *= this.swingSpeed
        }

        //add area effects
        for (let j = 0; j < this.damResist.length; j++) {
            this.damResist[j] = Math.max(0,Math.min(0.9, this.damResist[j] + this.parentDungeonFloor.parentArea.enemyDamResist[j]))
            //this.damOutput[j] *= this.prefix[i].modDamOutput[j]
        }

        this.maxhp = Math.max(1, this.maxhp) 
        this.name += this.type.name
        this.curhp = this.maxhp

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

    dealDamage() {
        if (this.curhp > 0) {
            return Player.curPlayer.takeDamage(this.damOutput)
        }
        else return false
    }

    fullheal() {
        this.curhp = this.maxhp
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
            if (this.damOutput[i] > 0) {
                resists = true
                preoutput += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle ' + Weapon.damageColors[i] + " " + width + '">'
                preoutput += '<i class="bi margin:auto bi-' + Weapon.damageIcons[i] + '"></i><br> ' + Weapon.formatString(this.damOutput[i], false) + " </span>"
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



export default Enemy;