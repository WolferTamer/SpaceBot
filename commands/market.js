var getMarketFile = require('./../utils/market_utils.js')["getMarketFile"];

module.exports = {
    name: 'market',
    cooldown: 5,
    description: "View the global market to see what's on sale!",
    usage: ".market",
    async execute(client, message, args, Discord, profileData) {

        //TODO: Display items, each associated with numbers 1-n. Multiple pages eventually, start with just one
        const data = getMarketFile();
        var description = "";
        var i = 1;
        for(let item of data) {
            const emoji = client.emojis.cache.find(emoji => emoji.name === item["id"]);
            if(typeof emoji !== "undefined") {
                description += `${i}: ${emoji} $${item["cost"]}\n`;
            } else {
                description += `${i}: ${item["id"]} $${item["cost"]}\n`;
            }
            i++;
        }
        
        const resourceEmbed = new Discord.MessageEmbed()
            .setColor("#2228bf")
            .setTitle('Marketplace:')
            .setDescription(description)
        var sentMessage = await message.reply({embeds: [resourceEmbed]});
    }
}