import DungeonFloor from "./dungeonFloor"
import Weapon from "./weapon";

class EnemyType {
    name: string;
    baseDamResist: number[];
    baseDamOutput: number[];
    baseHP: number;

    constructor(name: string, baseHP: number, baseDamResist: number[], baseDamOutput: number[]) {
        this.name = name
        this.baseDamResist = baseDamResist;
        this.baseHP = baseHP;
        this.baseDamOutput = baseDamOutput;
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

    parentDungeonFloor: DungeonFloor

    //sharp, blunt, magic/radiation, explosive
    //name, basehp, baseDamResist, baseDamOutput
    static enemyTypes: EnemyType[] = [
        new EnemyType("Rat",                1,   [0.0, 0.0, 0.0, 0.0],  [1,  0,  0,  0]),
        new EnemyType("Skeleton",           5,   [0.2, 0.0, 0.0, 0.0],  [0, 5, 0,  0]),
        new EnemyType("Goblin",             5,   [0.0, 0.0, 0.0, 0.0],  [5, 0, 0,  0]),
        new EnemyType("Cheesemonger",       15,  [0.0, 0.0, 0.0, 0.0],  [0, 10, 0,  0]),
        new EnemyType("Troll",              20,  [0.3, 0.0, 0.0, 0.0],  [0, 10, 0,  0]),
        
    ]

    static enemyPrefixArmor: EnemyPrefix[] = [
        new EnemyPrefix("Padded",           1,   [0.0, 0.5, 0.0, 0.5],  [0,  0,  0,  0]),
        new EnemyPrefix("Lead-lined",       1,   [0.0, 0.0, 0.5, 0.0],  [0,  0,  0,  0]),
        new EnemyPrefix("Armored",          1,   [0.6, 0.1, 0.0, 0.2],  [0,  0,  0,  0]),
        new EnemyPrefix("Scaled",           1,   [0.5, 0.0, 0.0, 0.0],  [0,  0,  0,  0]),
        new EnemyPrefix("Naked",            1,   [-0.5, -0.5, 0.0, -0.5],  [0,  0,  0,  0]),
        new EnemyPrefix("Warded",           1,   [0.5, 0.5, 0.5, 0.5],  [0,  0,  0,  0]),
        new EnemyPrefix("Shielded",         1,   [0.5, 0.2, 0.0, 0.2],  [0,  0,  0,  0]),
    ]

    static enemyPrefixAttribute: EnemyPrefix[] = [
        new EnemyPrefix("Small",            0.5,   [0.0, 0.0, 0.2, 0.0],  [0.5,  0.5,  0.5,  0.5]),
        new EnemyPrefix("Tiny",             0.25,  [0.0, 0.0, 0.5, 0.0],  [0.25,  0.25,  0.25,  0.25]),
        new EnemyPrefix("Tall",             1.25,  [0.0, 0.0, 0.0, 0.0],  [1.25,  1.25,  1.25,  1.25]),
        new EnemyPrefix("Rotund",           2,     [0.0, 0.0, 0.0, 0.0],  [1,  1,  1,  1]),
        new EnemyPrefix("Musclebound",      1.5,   [0.0, 0.2, 0.0, 0.0],  [1.25,  1.25,  1,  1]),
        new EnemyPrefix("Scrawny",          0.5,   [0.0, 0.0, 0.2, 0.0],  [0.75,  0.75,  1,  1]),
    ]
    

    constructor(parentDungeonFloor: DungeonFloor) {
        this.level = parentDungeonFloor.level
        
        this.parentDungeonFloor = parentDungeonFloor

        this.type = Weapon.randItem(Enemy.enemyTypes)
        this.maxhp = this.type.baseHP * Math.pow(1.3,this.level)

        if (Weapon.randInt(9) <= 3) this.prefix = [Weapon.randItem(Enemy.enemyPrefixArmor)];
        else if (Weapon.randInt(9) <= 8) this.prefix = [Weapon.randItem(Enemy.enemyPrefixAttribute)];
        else {
            this.prefix = [Weapon.randItem(Enemy.enemyPrefixArmor), Weapon.randItem(Enemy.enemyPrefixAttribute)]
        }

        this.name = this.type.name
        for (let i = 0; i < this.prefix.length; i++) {
            this.name = this.prefix[i].name + " "
            this.maxhp *= this.prefix[i].modHP
        }
        this.name += this.type.name

        
        this.curhp = this.maxhp

    }

    dealDamage(toDeal: number) {
        this.curhp = Math.max(0,this.curhp-toDeal)
        if (this.curhp == 0) return true
        return false
    }
}



export default Enemy;