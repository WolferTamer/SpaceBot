const { MessageActionRow, MessageButton } = require('discord.js');
const profileModel = require('../models/profileSchema');

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

        var resourceDescription = "";
        const resources = invProfile["resources"];
        for(let item of resources.keys()) {
            if(typeof resources.get(item) !== "undefined") {
                const emoji = client.emojis.cache.find(emoji => emoji.name === item);
                if(typeof emoji !== "undefined") {
                    resourceDescription += `${resources.get(item)}x ${emoji} \n`;
                } else {
                    resourceDescription += `${resources.get(item)}x ${item} \n`;
                }
            }
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
            .setColor([235,125,52])
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