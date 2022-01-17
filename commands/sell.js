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
    async execute(client, message, args, Discord, profileData) {
        const amount = parseInt(args[0]);
        if(amount == NaN) {
            message.channel.send(`${args[0]} was not recognized as a number, please enter an amount to sell as the first parameter.`);
            return null;
        }

        var item = resourceData["resources"].find(element => element.id === args[1]);
        if (item == undefined) {
            var word = args[2];
            for(var i = 3; i < args.length; i++) {
                word.concat(' ', args[i]);
            }
            item = resourceData["resources"].find(element => element.name.toUpperCase() == word.toUpperCase());
        }

        if(item == undefined) {
            message.channel.send(`${word} was not recognized as a resource, please enter either a resource ID or name as the second parameter.`);
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

        var str = `resources.${item.id}`
        var data = {str: amount};

        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id
        }, {
            $inc: {
                coins: price,
                str
            }
        });
        message.channel.send(`You just sold ${amount} ${item.name} ${client.emojis.cache.find(emoji => emoji.name === item.id)} for ${price} coins`);
    }
}