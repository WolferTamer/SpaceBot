const profileModel = require('../models/profileSchema');

module.exports = {
    name: "inventory",
    cooldown: 5,
    aliases: ['inv', 'i'],
    description: "Get a list of all the items in your inventory.",
    usage: ".inventory",
    async execute(client, message, args, Discord, profileData) {
        var resourceDescription = "";
        const resources = profileData["resources"];
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
        const items = profileData["items"];
        for(let item of items.keys()) {
            if(typeof items.get(item) !== "undefined") {
                //const emoji = client.emojis.cache.find(emoji => emoji.name === items[item][0]);
                toolDescription+=`${items.get(item)}x ${item} \n`;
            }
        }
        

        const resourceEmbed = new Discord.MessageEmbed()
            .setColor('#eb7d34')
            .setTitle('Resources:')
            .setDescription(resourceDescription)
            .setFooter('React with 🔄 to cycle between sections.');
        const toolEmbed = new Discord.MessageEmbed()
            .setColor('#eb7d34')
            .setTitle('Tools:')
            .setDescription(toolDescription)
            .setFooter('React with 🔄 to cycle between sections.');
        var sentMessage = await message.channel.send(resourceEmbed);

        const filter = (reaction,user) => reaction.emoji.name === '🔄' && user.id === message.author.id;

        sentMessage.react('🔄');

        const collector = sentMessage.createReactionCollector(filter, {time: 120000, dispose: true});

        var changed = false;

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
    }
}