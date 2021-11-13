const fs = require('fs');
const profileModel = require('../models/profileSchema');
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "item",
    cooldown: 5,
    description: "Check an item's information",
    usage: ".item `[item id]`",
    async execute(client, message, args, Discord, profileData) {
        var tool = toolsData["tools"].find(element => element.id === args[0])
        if(typeof tool !== "undefined") {
            var description = tool.description;
            const embed = new Discord.MessageEmbed()
            .setColor('#080885')
            .setTitle('Info for '+ tool.name + ':')
            .setDescription(description)
            .setFooter('Today\'s item description has been provided by Wolfer & Abby Inc.');
            var message = await message.channel.send(embed) 
        } else {
            message.channel.send("Tool not found: " + args[0]);
        }
    }
}