import Item from "./item"
import 'bootstrap-icons/font/bootstrap-icons.css'

class WeaponType {
    name: string;
    baseSwingSpeed: number;
    baseDamage: number;
    baseDamageType: number; //0 sharp, 1 blunt

    constructor(newName: string, baseSwingSpeed: number, baseDamage: number, baseDamageType: number) {
        this.name = newName
        this.baseSwingSpeed = baseSwingSpeed;
        this.baseDamage = baseDamage;
        this.baseDamageType = baseDamageType
    }
}

class WeaponPrefix {
    name: string;
    baseSwingSpeedMod: number;
    baseDamageMod: number;
    baseDensityMod: number;
    baseHardnessMod: number;
    baseMagicMod: number;
    baseExplosiveMod: number;
    

    constructor(name: string, baseSwingSpeedMod: number, baseDamageMod: number, baseDensityMod: number, baseHardnessMod: number, baseMagicMod: number, baseExplosiveMod: number) {
        this.name = name
        this.baseSwingSpeedMod = baseSwingSpeedMod;
        this.baseDamageMod = baseDamageMod;
        this.baseDensityMod = baseDensityMod;
        this.baseHardnessMod = baseHardnessMod;
        this.baseMagicMod = baseMagicMod;
        this.baseExplosiveMod = baseExplosiveMod;
    }
}

class WeaponMaterial {
    name: string;
    baseDensity: number;
    baseHardness: number;
    baseMagic: number;
    baseExplosive: number;

    constructor(name: string, baseDensity: number, baseHardness: number, baseMagic: number, baseExplosive: number) {
        this.name = name
        this.baseDensity = baseDensity;
        this.baseHardness = baseHardness;
        this.baseMagic = baseMagic;
        this.baseExplosive = baseExplosive;
    }
}

class Weapon extends Item {
    level: number;
    type: WeaponType;
    prefix: WeaponPrefix[];
    material: WeaponMaterial;
    damage: number[];
    name: string;
    swingSpeed: number;


    static damageLabels: string[] = ["Shp", "Blt", "Mgc", "Exp", "Bld"]//["Sharp", "Blunt", "Magic", "Explosive", "Bleed???"]
    static damageIcons: string[] = ["triangle", "square", "filter", "arrows-fullscreen", "droplet-fill"]
    static damageColors: string[] = ["dark:bg-slate-800 dark:text-slate-300", "dark:bg-slate-600 dark:text-slate-300", "dark:bg-blue-900 dark:text-blue-300", "dark:bg-yellow-900 dark:text-yellow-300", "dark:bg-red-900 dark:text-red-300"]


    constructor(newLevel: number, parId: string) {
        super("", parId, false);
        this.level = newLevel;

        /** NAME, SWING SPEED, HIT DAMAGE, DENSITY MOD, HARDNESS MOD, MAGIC, EXPLOSIVE */

        const potentialTypes = [
            new WeaponType("Shiv", 2.2, 0.3, 0),
            new WeaponType("Dagger", 2, 0.4, 0),
            new WeaponType("Sword", 1, 1, 0),
            new WeaponType("Pike", 0.5, 1.8, 0),
            new WeaponType("Hammer", 1, 1, 1),
            new WeaponType("Flail", 0.5, 2, 1),
            new WeaponType("Club", 1, 1, 1),
        ]

        const potentialQualityPrefixes = [
            new WeaponPrefix("Broken", 1, 0.5, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Shoddy", 1, 0.7, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Rusty", 1, 0.8, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Chipped", 1, 0.8, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Factory Refurbished", 1, 1, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Tuned", 1.1, 1.1, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Honed", 1.0, 1.2, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Tempered", 1.0, 1.2, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Scintillating", 1, 1.3, 1, 1, 0.0, 0.0),
            new WeaponPrefix("Masterwork", 1, 1.5, 1, 1, 0.0, 0.0),
        ]

        const potentialModPrefixes = [
            //new WeaponPrefix("",      1.0, 1.0, 1.0, 1.0, 0.0, 0.0),
            new WeaponPrefix("Dense",       0.8, 1.2, 1.5, 1.0, 0.0, 0.0),
            new WeaponPrefix("Blunt",       0.8, 1.0, 1.1, 0.5, 0.0, 0.0),
            new WeaponPrefix("Lightweight", 1.2, 0.8, 0.8, 1.0, 0.0, 0.0),
            new WeaponPrefix("Greasy",      1.1, 1.0, 1.0, 1.0, 0.0, 0.0),
            new WeaponPrefix("Aerodynamic", 1.2, 1.0, 1.0, 1.0, 0.0, 0.0),
            new WeaponPrefix("Porous",      1.3, 0.8, 0.7, 1.0, 0.0, 0.0),
            new WeaponPrefix("Soggy",       0.8, 0.8, 1.2, 1.0, 0.0, 0.0),
            new WeaponPrefix("Spongy",      1.2, 0.5, 0.8, 0.7, 0.0, 0.0),
            new WeaponPrefix("Elastic",     1.3, 0.5, 1.0, 0.5, 0.0, 0.0),
            new WeaponPrefix("Barbed",      0.9, 1.2, 1.0, 1.0, 0.0, 0.0),
            new WeaponPrefix("Serrated",    0.9, 1.1, 1.0, 1.0, 0.0, 0.0),
            new WeaponPrefix("Keen",        0.9, 1.1, 1.0, 1.2, 0.0, 0.0),
            new WeaponPrefix("Sticky",      1.2, 1.1, 1.0, 1.0, 0.0, 0.0),
            new WeaponPrefix("Irradiated ", 1.0, 1.0, 1.0, 1.0, 0.5, 0.0),
            new WeaponPrefix("Glowing ",    1.0, 1.0, 1.0, 1.0, 0.2, 0.0),
            new WeaponPrefix("Proximity Fused ", 1.0, 1.0, 1.0, 1.0, 0.0, 0.5), 
        ]

        /** NAME, DENSITY (~0.5-2), HARDNESS (~0.5-2), MAGIC (0-2), EXPLOSIVE (0-2) */

        const potentialMaterials = [
            new WeaponMaterial("Wooden",    0.5, 0.5, 0.0, 0.0),
            new WeaponMaterial("Stone",     1.0, 0.7, 0.0, 0.0),
            new WeaponMaterial("Copper",    1.3, 0.8, 0.0, 0.0),
            new WeaponMaterial("Iron",      1.2, 1.0, 0.0, 0.0),
            new WeaponMaterial("Steel",     1.2, 1.3, 0.0, 0.0),
            new WeaponMaterial("Lead",      1.7, 0.3, 0.0, 0.0),
            new WeaponMaterial("Meteoric",  1.3, 1.5, 0.3, 0.0),
            new WeaponMaterial("Gold",      2.0, 0.4, 0.0, 0.0),
            new WeaponMaterial("Aluminum",  0.8, 0.9, 0.0, 0.0),
            new WeaponMaterial("Lithium",   0.3, 0.3, 0.0, 1.0),
            new WeaponMaterial("Crystal",   0.9, 1.5, 0.5, 0.0),
            new WeaponMaterial("Magnesium", 0.6, 1.2, 0.0, 0.0),
            new WeaponMaterial("Uranium",   1.9, 1.0, 1.0, 0.0),
            new WeaponMaterial("Polonium",  1.1, 1.0, 2.0, 0.0),
            new WeaponMaterial("Diamond",   0.8, 2.0, 0.0, 0.0),
            new WeaponMaterial("Tungsten",  2.2, 1.8, 0.0, 0.0),
            new WeaponMaterial("Boron",     1.2, 1.9, 0.0, 0.0),
        ]

        this.type = this.randItem(potentialTypes);
        if (this.randInt(9) <= 3) this.prefix = [this.randItem(potentialQualityPrefixes)];
        else if (this.randInt(9) <= 8) this.prefix = [this.randItem(potentialModPrefixes)];
        else {
            this.prefix = [this.randItem(potentialQualityPrefixes), this.randItem(potentialModPrefixes)]
        }
        
        this.material = this.randItem(potentialMaterials);

        this.name = "Lv. " + this.level + " "
        for (let i = 0; i < this.prefix.length; i++) {
            /**if (i !== 0) this.name += "and ";*/
            this.name += this.prefix[i].name + " ";
        }
        this.name += this.material.name + " ";
        this.name += this.type.name + " ";

        this.damage = [0,0,0,0] // sharp, blunt, magic/radiation, explosive

        // handle swing speed
        this.swingSpeed = this.type.baseSwingSpeed * this.blendMod(1/this.material.baseDensity, 0.5, 1)
        for (let i = 0; i < this.prefix.length; i++) {
            this.swingSpeed *= this.blendMod(1/this.prefix[0].baseDensityMod, 0.25, 1) * this.blendMod(1/this.prefix[0].baseSwingSpeedMod, 0.5, 1)
        }

        // handle damage
        if (this.type.baseDamageType == 0) {
            //sharp
            this.damage[0] = this.type.baseDamage * this.blendMod(this.material.baseHardness, 0.5, 1) * this.blendMod(this.material.baseDensity, 0.1, 1)
            for (let i = 0; i < this.prefix.length; i++) {
                this.damage[0] *= this.blendMod(this.prefix[0].baseHardnessMod, 0.25, 1) * this.blendMod(this.prefix[0].baseDamageMod, 0.75, 1)
            }
        }
        else {
            //blunt
            this.damage[1] = this.type.baseDamage * this.blendMod(this.material.baseHardness, 0.1, 1) * this.blendMod(this.material.baseDensity, 0.5, 1)
            for (let i = 0; i < this.prefix.length; i++) {
                this.damage[0] *= this.blendMod(this.prefix[0].baseDensityMod, 0.25, 1) * this.blendMod(this.prefix[0].baseDamageMod, 0.75, 1)
            }
        }

        // handle extra damage
        // "magic"
        var magicMult = this.material.baseMagic

        for (let i = 0; i < this.prefix.length; i++) {
            magicMult += this.prefix[0].baseMagicMod
        }
        this.damage[2] = this.type.baseDamage * magicMult

        // "explosive"
        var explosiveMult = this.material.baseExplosive

        for (let i = 0; i < this.prefix.length; i++) {
            explosiveMult += this.prefix[0].baseExplosiveMod
        }
        this.damage[3] = this.type.baseDamage * explosiveMult

        //levelize damage - x1.25/level
        for (let i = 0; i < this.damage.length; i++) {
            this.damage[i] *= Math.pow(1.25,this.level)
        }

        this.serialId = super.serialIdGenerator()
    }

    blendMod(input: number, blendAmount: number, center: number) {
        return ((input-center)*blendAmount+center)
    }

    getCardInfo() { //toCompare: Weapon | undefined
        var output = ""
        var totDam = 0
        const width = "w-[5rem]"

        var preoutput = ""
        var tempString1=""
        var tempString2=""

        // handle damage type breakdown
        for (let i = 0; i < this.damage.length; i++) {
            if (this.damage[i] > 0) {
                /** right aligned symbol
                preoutput += '<span className="text-sm font-medium me-2 px-2.5 py-0.5 rounded inline-block text-right align-middle ' + Weapon.damageColors[i] + " " + width + '">'
                preoutput += '<span className="float-left"><i class="bi bi-' + Weapon.damageIcons[i] + '"></i></span> ' + this.formatString(this.damage[i]*this.swingSpeed) + "/s<br/>" + this.formatString(this.damage[i]) + "/h</span>"
                */
                preoutput += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle ' + Weapon.damageColors[i] + " " + width + '">'
                preoutput += '<i class="bi margin:auto bi-' + Weapon.damageIcons[i] + '"></i><br> ' + this.formatString(this.damage[i]) + " d/h<br/>" + this.formatString(this.damage[i]*this.swingSpeed) + " d/s</span>"
            }
            totDam += this.damage[i]
        }

        //constant tags
        //dps

        /** broken two box option 

        output += '<span className="inline-block space-y-2">'
        output += '<span className="text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-slate-500 dark:text-slate-300 block text-right align-middle ' + width + '">'
        output += '<span className="float-left"><i class="bi bi-' + "boxes" + '"></i></span> ' + (totDam*this.swingSpeed).toFixed(1) + "/s<br/>" + totDam.toFixed(1) + "/h</span>"

        output += '<span className="text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-slate-500 dark:text-slate-300 block text-right align-middle ' + width + '">'
        output += '<span className="d-flex justify-content-end"><i class="bi bi-stopwatch align-top"></i></span> ' + this.swingSpeed.toFixed(1) + "h/s</span></span>"
        */


        /** one box option*/
        output += '<span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded inline-block text-center align-middle dark:bg-slate-500 dark:text-slate-300 ' + width + '">'
        output += this.formatString(this.swingSpeed) + " h/s<br/>" + this.formatString(totDam) + " d/h<br/>" + this.formatString(totDam*this.swingSpeed) + " d/s</span>"
        //output += '<span className="float-left"><i class="bi bi-boxes"></i></span> ' + this.formatString(totDam*this.swingSpeed) + "/s<br/>" + this.formatString(totDam) + "/h<br/>" + this.formatString(1) + "h/s</span>"


        // break between constant and inconsistent tags
        //output += "<span classname='dark:text-slate-100'>|</span> "

        return output + preoutput + ""
    }

    randItem(input: any) {
        return input[Math.floor(Math.random() * input.length)]
    }

    randInt(max: number) {
        /** max is  inclusive*/
        return Math.floor(Math.random() * (max+1))
    }

    formatString(input: number) {
        if (input > 100000000) return (input/1000000).toFixed(0) + "m"
        else if (input > 10000000) return (input/1000000).toFixed(1) + "m"
        else if (input > 1000000) return (input/1000000).toFixed(2) + "m"
        else if (input > 100000) return (input/1000).toFixed(0) + "k"
        else if (input > 10000) return (input/1000).toFixed(1) + "k"
        else if (input > 1000) return (input/1000).toFixed(2) + "k"
        else if (input > 100) return input.toFixed(0)
        else return input.toFixed(1)
    }
    

}

export default Weapon;