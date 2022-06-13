const fs = require('fs');
const profileModel = require('../models/profileSchema');
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "recipe",
    cooldown: 5,
    aliases: ['r', 'rec'],
    description: "Check a recipe for an item.",
    usage: ".recipe `[item id]`",
    options: [
        {
            name: "item",
            description: "The item you want to check the recipe for",
            required: true,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        var tool = toolsData["tools"].find(element => element.id === args[0])
        if(typeof tool !== "undefined") {
            var description = "";
            for(key in tool.recipe) {
                var item = resourceData["resources"].find(element => element.id === key);
                description+=item.name + ": " + tool.recipe[key] + "\n";
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#2228bf')
            .setTitle('Recipe for '+ tool.name + ':')
            .setDescription(description)
            .setFooter({text:'Today\'s recipe has been provided by Wolfer & Abby Inc.'});
            var message = await message.reply({embeds: [embed]}) 
        } else {
            message.reply("Tool not found: " + args[0]);
        }
    }
}