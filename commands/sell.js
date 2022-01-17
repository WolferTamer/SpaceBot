const fs = require('fs');
const profileModel = require('../models/profileSchema');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "sell",
    cooldown: 5,
    aliases: ["s"],
    description: "Sell a resource from your inventory",
    usage: ".sell [amount] [resource]",
    options: [
        {
            name: "amount",
            description: "The amount of the resource you want to sell",
            required: true,
            type: 4
        }, {
            name: "resource",
            description: "The id of the resource you want to sell",
            required: true,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        const amount = parseInt(args[0]);
        if(amount == NaN) {
            message.reply(`${args[0]} was not recognized as a number, please enter an amount to sell as the first parameter.`);
            return null;
        }

        var item = resourceData["resources"].find(element => element.id === args[1]);
        if (typeof item === undefined) {
            var word = args[2];
            for(var i = 3; i < args.length; i++) {
                word.concat(' ', args[i]);
            }
            item = resourceData["resources"].find(element => element.name.toUpperCase() == word.toUpperCase());
        }

        if(typeof item === undefined) {
            message.reply(`${word} was not recognized as a resource, please enter either a resource ID or name as the second parameter.`);
            return null;
        }

        var price;
        if(item.rarity === "normal") {
            price = 1*amount;
        }
        else if(item.rarity === "uncommon") {
            price = 5*amount;
        }
        else if(item.rarity === "great") {
            price = 25*amount;
        }
        else if(item.rarity === "rare") {
            price = 100*amount;
        }
        else if(item.rarity === "unique") {
            price = 600*amount;
        }
        else if(item.rarity === "epic") {
            price = 3000*amount;
        }
        else if(item.rarity === "ultra") {
            price = 15000*amount;
        }

        
        var data = {};
        data[`resources.${item.id}`] = -amount;
        data['coins'] = -price

        const response = await profileModel.findOneAndUpdate({
            userID: message.member.id
        }, {
            $inc: data
        });
        message.reply(`You just sold ${amount} ${item.name} ${client.emojis.cache.find(emoji => emoji.name === item.id)} for ${price} coins`);
    }
}