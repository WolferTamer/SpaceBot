const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const profileModel = require('../models/profileSchema');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "inventory",
    cooldown: 5,
    aliases: ['inv', 'i'],
    description: "Get a list of all the items in your inventory.",
    usage: ".inventory `{user}`",
    options: [
        {
            name: "user",
            description: "The user to get the inventory of. Leave blank to see your inventory.",
            required: false,
            type: 6
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        var invUser;
        var invProfile = profileData;
        var callUser = message.user;
        if(typeof args[0] !== "undefined") {
            invUser = await message.guild.members.fetch(args[0]);
            try {
                invProfile = await profileModel.findOne({ userID: invUser.id });
            } catch (err) {
                console.log(err);
            }
        } else {
            invUser = message.user;
        }

        const resources = invProfile["resources"];
        var resourceArray = {}
        for(let item of resources.keys()) {
            const resource = resourceData["resources"].find(obj => obj.id === item)
            if(typeof resourceArray[resource.category] !== "undefined") {
                resourceArray[resource.category].push(item)
            } else {
                resourceArray[resource.category] = [item]
            }
        }

        var resourceDescription = "";
        for(let key of Object.keys(resourceArray)) {
            resourceDescription += `**${key.charAt(0).toUpperCase() + key.slice(1)}:** \n`
            for(let item of resourceArray[key]) {
                const emoji = client.emojis.cache.find(emoji => emoji.name === item);
                resourceDescription += `\`${resources.get(item)}x\` `
                if(typeof emoji === "undefined") {
                    resourceDescription += `${item}, `
                } else {
                    resourceDescription += `${emoji}, `
                }
            }
            resourceDescription += "\n\n"
        }

        var toolDescription = "";
        const items = invProfile["items"];
        for(let item of items.keys()) {
            if(typeof items.get(item) !== "undefined") {
                //const emoji = client.emojis.cache.find(emoji => emoji.name === items[item][0]);
                const emoji = client.emojis.cache.find(emoji => emoji.name === item);
                if(typeof emoji !== "undefined") {
                    toolDescription+=`${items.get(item)}x ${emoji} \n`;
                } else {
                    toolDescription+=`${items.get(item)}x ${item} \n`;
                }
            }
        }
        

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('invCycle')
                    .setLabel('Cycle')
                    .setStyle('PRIMARY')
            );
        const resourceEmbed = new Discord.MessageEmbed()
            .setColor('#2228bf')
            .setTitle('Resources:')
            .setDescription(resourceDescription)
        const toolEmbed = new Discord.MessageEmbed()
            .setColor([235,125,52])
            .setTitle('Tools:')
            .setDescription(toolDescription)
        var sentMessage = await message.reply({embeds: [resourceEmbed], components: [row], fetchReply: true});
        

        const collector = sentMessage.createMessageComponentCollector({componentType: 'BUTTON', time: 120000});

        var changed = false;

        collector.on('collect', async interaction => {
            if(interaction.customId === 'invCycle' && interaction.user.id == message.user.id) {
                if(changed) {
                    interaction.update({embeds: [resourceEmbed]});
                    changed = false;
                } else {
                    interaction.update({embeds: [toolEmbed]});
                    changed = true;
                }
            }
        });
    }
}