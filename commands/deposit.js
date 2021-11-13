const profileModel = require('../models/profileSchema');

module.exports = {
    name: "deposit",
    cooldown: 5,
    aliases: ["depo", "dp"],
    description: "Deposit an amount of money into your bank to gain interest.",
    usage: ".deposit `[amount]",
    async execute(client, message, args, Discord, profileData) {
        const depoAmount = Number(args[0]);
        if(profileData.coins >= depoAmount) {
            const response = await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    coins: -depoAmount,
                    bank: depoAmount
                }
            });
            message.channel.send(`${message.author.username}, you deposited ${depoAmount} into your bank. You now have ${profileData.bank + depoAmount} coins in your bank.`);
        } else {
            message.channel.send('You do not have enough coins to deposit that much into your bank.');
        }
    }
}