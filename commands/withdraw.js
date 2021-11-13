const profileModel = require('../models/profileSchema');

module.exports = {
    name: "widthdraw",
    cooldown: 5,
    aliases: ["wd"],
    description: "Withdraw from your bank",
    usage: ".widthdraw `[amount]`",
    async execute(client, message, args, Discord, profileData) {
        const depoAmount = Number(args[0]);
        if(profileData.bank >= depoAmount) {
            const response = await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    coins: depoAmount,
                    bank: -depoAmount
                }
            });
            message.channel.send(`${message.author.username}, you withdrew ${depoAmount} from your bank. You now have ${profileData.bank - depoAmount} coins in your bank.`);
        } else {
            message.channel.send('You do not have enough coins to withdraw that much from your bank.');
        }
    }
}