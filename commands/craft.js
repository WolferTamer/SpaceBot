const fs = require('fs');
const profileModel = require('../models/profileSchema');
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "craft",
    cooldown: 15,
    description: "Craft an item!",
    usage: ".craft `[item id]`",
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
                    userID: message.author.id
                }, {
                    $inc: cost
                });
                message.channel.send("You have crafted a " + tool.name);
            } else {
                message.channel.send("Not enough resources to craft this item!");
            }
        } else {
            message.channel.send("Tool not found: " + args[0]);
        }
    }
}