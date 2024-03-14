import DungeonFloor from "./dungeonFloor"
import Weapon from "./weapon"

class AreaPrefix {
    name: string
    enemyDamResist: number[]
    enemyNumMod: number
    playerDamResist: number[]
    allowedEnemyTypes: string[]

    constructor(name: string, enemyDamResist?: number[], playerDamResist?: number[], enemyNumMod?: number, allowedEnemyTypes?: string[]) {
        this.name = name

        // optional parameters
        //sharp, blunt, magic/radiation, explosive
        if (typeof enemyDamResist === 'undefined') this.enemyDamResist = [0,0,0,0]
        else this.enemyDamResist = enemyDamResist

        if (typeof playerDamResist === 'undefined') this.playerDamResist = [0,0,0,0]
        else this.playerDamResist = playerDamResist

        if (typeof enemyNumMod === 'undefined') this.enemyNumMod = 1
        else this.enemyNumMod = enemyNumMod

        if (typeof allowedEnemyTypes === 'undefined') this.allowedEnemyTypes = []
        else this.allowedEnemyTypes = allowedEnemyTypes
        
    }
}

class AreaType {
    name: string
    allowedEnemyTypes: string[]
    bossTypes: string[]

    constructor(name: string, allowedEnemyTypes: string[], bossTypes: string[]) {
        this.name = name
        this.allowedEnemyTypes = allowedEnemyTypes
        this.bossTypes = bossTypes
    }
}


class DungeonArea {
    name: string
    prefix: AreaPrefix
    type: AreaType
    allowedList: string[]
    bossTypes: string[]

    enemyDamResist: number[]
    enemyNumMod: number
    playerDamResist: number[]
    
    static layerColors: string[] = ["bg-yellow-900", "bg-slate-800", "bg-slate-400", "bg-slate-900"]

    static prefixes: AreaPrefix[] = [
        // need to change
        new AreaPrefix("Dank"),
        new AreaPrefix("Cavernous", undefined, undefined, 1.5), //change


        new AreaPrefix("Well-lit", undefined, undefined, undefined, ["Torch Repairman"]),
        new AreaPrefix("Gentrified", undefined, undefined, undefined, ["Barista", "Astrologist"]),
        new AreaPrefix("Crystalline", [0.5, 0, 0, 0]),
        new AreaPrefix("Overcrowded", undefined, undefined, 2),
        new AreaPrefix("Empty", undefined, undefined, 0.2, ["Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat"]),
        new AreaPrefix("Infested", undefined, undefined, 1, ["Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat"]),
        new AreaPrefix("OSHA-Compliant", [0.2, 0.2, 0.5, 0.5],  [0.2, 0.2, 0.5, 0.5], undefined, ["Safety Inspector"]),

        new AreaPrefix("Spooky", undefined, undefined, undefined, ["Ghost", "Ghost"]),
        new AreaPrefix("Public", undefined, undefined, undefined, ["Cheesemonger", "Minstrel", "Drunkard"]),
        
    ]

    static types: AreaType[] = [
        new AreaType("Crypt", ["Rat", "Skeleton", "Zombie", "Ghost", "Spider"], ["Lich"]),
        new AreaType("Barrow", ["Rat", "Skeleton", "Zombie"], ["Wight"]),
        new AreaType("Hamlet", ["Rat", "Cheesemonger", "Minstrel", "Drunkard"], ["Mayor"]),
        new AreaType("Cave", ["Rat", "Bat", "Goblin", "Bear", "Spider"], ["Troll"]),
        new AreaType("Warren", ["Rat", "Rat", "Rat", "Rat", "Rat", "Rat", "Rat"], ["Rat"]),
        new AreaType("Mineshaft", ["Rat", "Miner", "Minor"], ["Geologist"]),
        //new AreaType("Bunker", ["Rat"], ["Rat"]), //change
    ]
    

    constructor() {
        this.prefix = Weapon.randItem(DungeonArea.prefixes)
        this.type = Weapon.randItem(DungeonArea.types)


        this.name = this.prefix.name + " " + this.type.name

        this.allowedList = this.type.allowedEnemyTypes.concat(this.prefix.allowedEnemyTypes)
        this.bossTypes = this.type.bossTypes

        this.enemyNumMod = this.prefix.enemyNumMod
        this.enemyDamResist = this.prefix.enemyDamResist
        this.playerDamResist = this.prefix.playerDamResist

    }
}


export default DungeonArea;