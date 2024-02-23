import "react";

class Item {
    name: string;
    curParId: string;
    serialId: string;
    isPlaceholder: boolean;

    constructor(newName: string, parId: string, isPlaceholder: boolean) {
        this.name = newName;
        this.curParId = parId;
        this.serialId = this.serialIdGenerator();
        this.isPlaceholder = isPlaceholder;
    }

    serialIdGenerator() {
        /**var kek = ""
        kek += "name: " + this.name */
        return this.guidGenerator()
    }

    guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

}

export default Item;