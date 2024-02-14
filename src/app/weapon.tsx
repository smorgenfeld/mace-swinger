import Item from "./item"

class WeaponType {
    name: string;
    baseSwingSpeed: number;
    baseDamage: number;

    constructor(newName: string, baseSwingSpeed: number, baseDamage: number) {
        this.name = newName
        this.baseSwingSpeed = baseSwingSpeed;
        this.baseDamage = baseDamage;
    }
}

class WeaponPrefix {
    name: string;
    baseSwingSpeed: number;
    baseDamageMod: number;

    constructor(name: string, baseSwingSpeed: number, baseDamageMod: number) {
        this.name = name
        this.baseSwingSpeed = baseSwingSpeed;
        this.baseDamageMod = baseDamageMod;
    }
}

class WeaponMaterial {
    name: string;
    baseSwingSpeed: number;
    baseDamageMod: number;

    constructor(name: string, baseSwingSpeed: number, baseDamageMod: number) {
        this.name = name
        this.baseSwingSpeed = baseSwingSpeed;
        this.baseDamageMod = baseDamageMod;
    }
}

class Weapon extends Item {
    level: number;
    type: WeaponType;
    prefix: WeaponPrefix[];
    material: WeaponMaterial;
    damage: number;
    name: string;

    constructor(newLevel: number, parId: string) {
        super("", parId, false);
        this.level = newLevel;
        this.damage = this.level;

        /** NAME, SWING SPEED, HIT DAMAGE */

        const potentialTypes = [
            new WeaponType("Shiv", 2.2, 0.3),
            new WeaponType("Dagger", 2, 0.4),
            new WeaponType("Sword", 1, 1),
            new WeaponType("Pike", 0.5, 1.8),
            new WeaponType("Hammer", 1, 1),
            new WeaponType("Flail", 1, 1),
            new WeaponType("Club", 1, 1),
        ]

        const potentialQualityPrefixes = [
            new WeaponPrefix("Broken", 1, 0.5),
            new WeaponPrefix("Shoddy", 1, 0.7),
            new WeaponPrefix("Rusty", 1, 0.8),
            new WeaponPrefix("Factory Refurbished", 1, 1),
            new WeaponPrefix("Tuned", 1.1, 1.1),
            new WeaponPrefix("Honed", 1.0, 1.2),
            new WeaponPrefix("Tempered", 1.0, 1.2),
            new WeaponPrefix("Scintillating", 1, 1.3),
            new WeaponPrefix("Masterwork", 1, 1.5),
        ]
        const potentialModPrefixes = [
            new WeaponPrefix("Dense", 0.8, 1.2),
            new WeaponPrefix("Lightweight", 1.2, 0.8),
            new WeaponPrefix("Greasy", 1.1, 1),
            new WeaponPrefix("Aerodynamic", 1.2, 1),
            new WeaponPrefix("Porous", 1.3, 0.8),
            new WeaponPrefix("Soggy", 0.8, 0.8),
            new WeaponPrefix("Spongy", 1.2, 0.5),
            new WeaponPrefix("Elastic", 1.3, 0.5),
            new WeaponPrefix("Barbed", 0.9, 1.2),
            new WeaponPrefix("Serrated", 0.9, 1.1),
        ]

        const potentialMaterials = [
            new WeaponMaterial("Wooden", 1, 1),
            new WeaponMaterial("Stone", 1, 1),
            new WeaponMaterial("Copper", 1, 1),
            new WeaponMaterial("Lead", 1, 1),
            new WeaponMaterial("Iron", 1, 1),
            new WeaponMaterial("Steel", 1, 1),
            new WeaponMaterial("Golden", 1, 1),
            new WeaponMaterial("Meteoric", 1, 1),
            new WeaponMaterial("Aluminum", 1, 1),
        ]

        this.type = this.randItem(potentialTypes);
        if (this.randInt(9) <= 3) this.prefix = [this.randItem(potentialQualityPrefixes)];
        else if (this.randInt(9) <= 8) this.prefix = [this.randItem(potentialModPrefixes)];
        else {
            this.prefix = [this.randItem(potentialQualityPrefixes), this.randItem(potentialModPrefixes)]
        }
        
        this.material = this.randItem(potentialMaterials);

        /**this.type = potentialTypes[0]
        this.prefix = [potentialPrefixes[0]]
        this.material = potentialMaterials[0]*/

        this.name = ""
        for (let i = 0; i < this.prefix.length; i++) {
            /**if (i !== 0) this.name += "and ";*/
            this.name += this.prefix[i].name + " ";
        }
        this.name += this.material.name + " ";
        this.name += this.type.name + " ";

        this.serialId = super.serialIdGenerator()
    }



    randItem(input: any) {
        return input[Math.floor(Math.random() * input.length)]
    }

    randInt(max: number) {
        /** max is  inclusive*/
        return Math.floor(Math.random() * (max+1))
    }
    

}

export default Weapon;