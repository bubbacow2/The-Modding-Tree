addLayer("p", {
    name: "dingus", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(10),
    }},
    color: "#596454ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "dingus points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Upgrade 1",
            description: "Double point gain",
            cost: new Decimal(1),
        },
        12: {
            title: "Upgrade 2",
            description: "Gain a multiplier to point gain based on points",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            }, // Add formatting to the effect
        },
        13: {
            title: "Upgrade 3",
            description: "Gain a power effect to point gain",
            cost: new Decimal(3),
            effect() {
                return player.points.add(1).pow(0.15)
            },
        },
    },
})


// A side layer with achievements, with no prestige
addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            image: "discord.png",
            name: "Get me!",
            done() {return true}, // This one is a freebie
            goalTooltip: "How did this happen?", // Shows when achievement is not completed
            doneTooltip: "You did it!", // Showed when the achievement is completed
        },
        12: {
            name: "Impossible!",
            done() {return false},
            goalTooltip: "Mwahahaha!", // Shows when achievement is not completed
            doneTooltip: "HOW????", // Showed when the achievement is completed
            textStyle: {'color': '#04e050'},
        },
        13: {
            name: "EIEIO",
            done() {return player.f.points.gte(1)},
            tooltip: "Get a farm point.\n\nReward: The dinosaur is now your friend (you can max Farm Points).", // Showed when the achievement is completed
            onComplete() {console.log("Bork bork bork!")}
        },
    },
    midsection: ["grid", "blank"],
    grid: {
        maxRows: 3,
        rows: 2,
        cols: 2,
        getStartData(id) {
            return id
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return player.points.eq(10)
        },
        getStyle(data, id) {
            return {'background-color': '#'+ (data*1234%999999)}
        },
        onClick(data, id) { // Don't forget onHold
            player[this.layer].grid[id]++
        },
        getTitle(data, id) {
            return "Gridable #" + id
        },
        getDisplay(data, id) {
            return data
        },
    },
},
)