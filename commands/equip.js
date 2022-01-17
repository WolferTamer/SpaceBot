const fs = require('fs');
const profileModel = require('../models/profileSchema');
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "equip",
    cooldown: 5,
    aliases: ['r', 'rec'],
    description: "Equip a tool that you have crafted.",
    usage: ".equip `[item id]`",
    options: [
        {
            name: "id",
            description: "The id of the item you want to equip",
            required: false,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        var tool = toolsData["tools"].find(element => element.id === args[0]);
        if(typeof tool !== "undefined") {
            var description = "";
            const response = await profileModel.findOneAndUpdate({
                userID: message.member.id
            }, {
                $set: {
                    equipped: tool.id
                }
            });
            var message = await message.reply("Equipped " + args[0]);
        } else {
            tool = profileData.equipped;
            if(typeof tool !== "undefined") {
                message.reply("You currently have " + tool + " equipped.");
            }else {
                message.reply("You don't have any tools equipped");
            }
        }
    }
}