const fs = require('fs');
const profileModel = require('../models/profileSchema');
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "craft",
    cooldown: 15,
    description: "Craft an item using resources gotten from gathering.",
    usage: ".craft `[item id]`",
    category: "Inventory",
    options: [
        {
            name: "item",
            description: "The id of the item you want to craft",
            required: true,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        var tool = toolsData["tools"].find(element => element.id === args[0]);
        if(typeof tool !== "undefined") {
            var enough = true;
            var cost = {};
            for(key in tool.recipe) {
                //var item = resourceData["resources"].find(element => element.id === key);
                var playerAmount = profileData.resources.get(key);
                if(playerAmount < tool.recipe[key]) {
                    enough = false;
                } else {
                    cost["resources."+key] =  -tool.recipe[key];
                }
            }
            if(enough) {
                cost["items."+args[0]] = 1;
                const response = await profileModel.findOneAndUpdate({
                    userID: message.member.id
                }, {
                    $inc: cost
                });
                message.reply("You have crafted a " + tool.name);
            } else {
                message.reply("Not enough resources to craft this item!");
            }
        } else {
            message.reply("Tool not found: " + args[0]);
        }
    }
}