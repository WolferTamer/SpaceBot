class Pet {
    static createPet(name, id, level) {
        switch (id) {
            case "wolf":
                return new Wolf(name, id, level)
            default:
                return null
        }
    }
    constructor(name, id, level) {
        this.name = name
        this.id = id
        this.level = level
    }
    getModifier(modID) {
        return 1;
    }

    getDescription() {
        return "This is the default pet. You probably shouldn't have this."
    }
}

class Wolf extends Pet {
    getModifier(modID) {
        switch(modID) {
            case "gatherAmount":
                return 1 + .1*Math.floor(this.level/5+1)
            default:
                return 1
        }
    }

    getDescription() {
        return `Wolf: ${10*Math.floor(this.level/5+1)}% more resources gathered with /gather.`
    }
}

module.exports = Pet;