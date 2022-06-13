var getMarketFile = require('./../utils/market_utils.js')["getMarketFile"];
const profileModel = require('../models/profileSchema');

module.exports = {
    name: 'buy',
    cooldown: 5,
    description: "Buy an item on the market",
    usage: ".buy `[item number]` `{amount}`",
    category: "Economy",
    options: [
        {
            name: "number",
            description: "The item number of the item you wish to buy",
            required: true,
            type: 4
        }, {
            name: "amount",
            description: "The amount of items you want to buy",
            required: false,
            type: 4
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        const itemNum = parseInt(args[0]);
        var amount = 1;
        if(typeof args[1] !== "undefined" && parseInt(args[1]) != NaN) {
            amount = parseInt(args[1]);
        } 
        const marketList = getMarketFile();
        var item;
        if(itemNum <= marketList.length && itemNum > 0) {
            item = marketList[itemNum-1];
        } else {
            message.reply(`The item number ${itemNum} is not available in the market, please select another number.`);
            return;
        }

        if(item["cost"]*amount == NaN || item["cost"]*amount <= 0 || item["cost"]*amount > profileData.coins) {
            message.reply(`You do not have the funds to pay for these items or the amount you wish to spend was invalid.`);
            return;
        }

        var data = {};
        data[`resources.${item.id}`] = amount;
        data['coins'] = -item["cost"]*amount;

        const response = await profileModel.findOneAndUpdate({
            userID: message.member.id
        }, {
            $inc: data
        });
        message.reply(`You just bought ${amount} ${item.name} ${client.emojis.cache.find(emoji => emoji.name === item.id)} for ${item["cost"]*amount} coins`);
    }
}