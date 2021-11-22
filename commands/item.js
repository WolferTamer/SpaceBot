const fs = require('fs');
const profileModel = require('../models/profileSchema');
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "item",
    cooldown: 5,
    description: "Look at a list of items or check a specific item's stats.",
    usage: ".item `{item id}`",
    async execute(client, message, args, Discord, profileData) {

        

        if(typeof args[0] !== "undefined") {
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
        } else {
            var toolDescription = "";
            for(const tool of toolsData["tools"]) {
                const emoji = client.emojis.cache.find(emoji => emoji.name === tool.id);
                if(typeof emoji !== "undefined") {
                    toolDescription += `${emoji} : `;
                }
                toolDescription += `${tool.id} : ${tool.name}\n`;
            }

            const common = resourceData["resources"].filter((data) => {
                return data.rarity === "normal";
            });
            const uncommon = resourceData["resources"].filter((data) => {
                return data.rarity === "uncommon";
            });
            const great = resourceData["resources"].filter((data) => {
                return data.rarity === "great";
            });
            const rare = resourceData["resources"].filter((data) => {
                return data.rarity === "rare";
            });
            const unique = resourceData["resources"].filter((data) => {
                return data.rarity === "unique";
            });
            const epic = resourceData["resources"].filter((data) => {
                return data.rarity === "epic";
            });
            const ultra = resourceData["resources"].filter((data) => {
                return data.rarity === "ultra";
            });

            const resourceDoubleList = [common, uncommon, great, rare, unique, epic, ultra];
            var resourceDescriptions = [];

            for(const array in resourceDoubleList) {
                var resourceDescription = "";
                for(const resource of resourceDoubleList[array]) {
                    const emoji = client.emojis.cache.find(emoji => emoji.name === resource["id"]);
                    if(typeof emoji !== "undefined") {
                        resourceDescription += `${emoji} : `;
                    }
                    resourceDescription += `${resource["id"]} : ${resource["name"]} (${resource["rarity"]})\n`;
                }
                resourceDescriptions.push(resourceDescription);
            }

            const toolEmbed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('List of tools:')
                .setDescription(toolDescription)
                .setFooter('React with 🔄 to cycle between sections.'); 
            var resourceEmbed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('List of resources:')
                .setDescription(resourceDescriptions[0])
                .setFooter('React with 🔄 to cycle between sections and ⬅️/➡️ to switch between rarities.');
            var sentMessage = await message.channel.send(resourceEmbed) 
            
            const filter = (reaction,user) => reaction.emoji.name === '🔄' && user.id === message.author.id;
            const filtertwo = (reaction,user) => (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️') && user.id === message.author.id;

            sentMessage.react('⬅️');
            sentMessage.react('➡️');
            sentMessage.react('🔄');

            const collector = sentMessage.createReactionCollector(filter, {time: 120000, dispose: true});
            const collector2 = sentMessage.createReactionCollector(filtertwo, {time: 120000, dispose: true})

            var changed = false;
            var resourcePage = 0;

            collector.on('collect', async (reaction, user) => {
                if(changed) {
                    sentMessage.edit(resourceEmbed);
                    changed = false;
                } else {
                    sentMessage.edit(toolEmbed);
                    changed = true;
                }
            });

            collector.on('remove', async (reaction, user) => {
                if(changed) {
                    sentMessage.edit(resourceEmbed);
                    changed = false;
                } else {
                    sentMessage.edit(toolEmbed);
                    changed = true;
                }
            });

            collector2.on('collect', async (reaction, user) => {
                if(!changed) {
                    if(reaction.emoji.name === '⬅️' && resourcePage > 0) {
                        resourcePage--;
                        resourceEmbed = resourceEmbed
                        .setTitle('List of resources:')
                        .setDescription(resourceDescriptions[resourcePage])
                        sentMessage.edit(resourceEmbed);
                    } else if(reaction.emoji.name === '➡️' && resourcePage < resourceDescriptions.length-1) {
                        resourcePage++;
                        resourceEmbed = resourceEmbed
                        .setDescription(resourceDescriptions[resourcePage])
                        sentMessage.edit(resourceEmbed);
                    }
                }
            });

            collector2.on('remove', async (reaction, user) => {
                if(!changed) {
                    if(reaction.emoji.name === '⬅️' && resourcePage > 0) {
                        resourcePage--;
                        resourceEmbed = resourceEmbed
                        .setDescription(resourceDescriptions[resourcePage])
                        .setFooter('React with 🔄 to cycle between sections and ⬅️/➡️ to switch between rarities.');
                        sentMessage.edit(resourceEmbed);
                    } else if(reaction.emoji.name === '➡️' && resourcePage < resourceDescriptions.length-1) {
                        resourcePage++;
                        resourceEmbed = resourceEmbed
                        .setDescription(resourceDescriptions[resourcePage])
                        .setFooter('React with 🔄 to cycle between sections and ⬅️/➡️ to switch between rarities.');
                        sentMessage.edit(resourceEmbed);
                    }
                }
            });
        }
    }
}