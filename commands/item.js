const { MessageButton, MessageActionRow } = require('discord.js');
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
    options: [
        {
            name: "item",
            description: "The id of the item you want more info on",
            required: false,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {

        

        if(typeof args[0] !== "undefined") {
            var tool = toolsData["tools"].find(element => element.id === args[0])
            if(typeof tool !== "undefined") {
                var description = tool.description;
                const embed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('Info for '+ tool.name + ':')
                .setDescription(description)
                .setFooter({text:'Today\'s item description has been provided by Wolfer & Abby Inc.'});
                var message = await message.reply({embeds: [embed]}) 
            } else {
                message.reply("Tool not found: " + args[0]);
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

            const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('itemLeft')
                    .setLabel('Shift left')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('itemRight')
                    .setLabel('Shift Right')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('itemCycle')
                    .setLabel('Cycle')
                    .setStyle('PRIMARY')
                ]
            );
            const toolEmbed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('List of tools:')
                .setDescription(toolDescription)
                .setFooter({text:'React with 🔄 to cycle between sections.'}); 
            var resourceEmbed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('List of resources:')
                .setDescription(resourceDescriptions[0])
                .setFooter({text:'Use shift left/right to switch between rarities.'});
            var sentMessage = await message.reply({embeds: [resourceEmbed], components: [row], fetchReply: true}) 
            

            const collector = sentMessage.createMessageComponentCollector({componentType: 'BUTTON', time: 120000});

            var changed = false;
            var resourcePage = 0;

            collector.on('collect', async interaction => {
                if(interaction.customId === "itemCycle") {
                    if(changed) {
                        var components = interaction.message.components[0].components;
                        components[0] = components[0].setDisabled(false);
                        components[1] = components[1].setDisabled(false);
                        interaction.update({embeds: [resourceEmbed], components: [new MessageActionRow().addComponents(components)]});
                        changed = false;
                    } else {
                        var components = interaction.message.components[0].components;
                        components[0] = components[0].setDisabled(true);
                        components[1] = components[1].setDisabled(true);
                        interaction.update({embeds: [toolEmbed], components: [new MessageActionRow().addComponents(components)]});
                        changed = true;
                    }
                } else if (interaction.customId === "itemLeft" && !changed) {
                    resourcePage--;
                    resourceEmbed = resourceEmbed
                    .setTitle('List of resources:')
                    .setDescription(resourceDescriptions[resourcePage])
                    interaction.update({embeds: [resourceEmbed]});
                } else if (interaction.customId === "itemRight" && !changed) {
                    resourcePage++;
                    resourceEmbed = resourceEmbed
                    .setDescription(resourceDescriptions[resourcePage])
                    interaction.update({embeds: [resourceEmbed]});
                }
            });
        }
    }
}