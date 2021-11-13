const profileModel = require('../models/profileSchema');

module.exports = {
    name: "inventory",
    cooldown: 5,
    aliases: ['inv', 'i'],
    description: "Get a list of all the items in your inventory.",
    usage: ".inventory",
    async execute(client, message, args, Discord, profileData) {
        var description = "";
        const resources = profileData["resources"];
        for(let item of resources.keys()) {
            if(typeof resources.get(item) !== "undefined") {
                const emoji = client.emojis.cache.find(emoji => emoji.name === item);
                description+=`${resources.get(item)}x ${emoji} \n`;
            }
        }

        const items = profileData["items"];
        for(let item of items.keys()) {
            if(typeof items.get(item) !== "undefined") {
                //const emoji = client.emojis.cache.find(emoji => emoji.name === items[item][0]);
                description+=`${items.get(item)}x ${item} \n`;
            }
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#eb7d34')
            .setTitle('Items:')
            .setDescription(description)
            .setFooter('Today\'s list has been provided by Wolfer & Abby Inc.');
        message.channel.send(embed);
    }
}