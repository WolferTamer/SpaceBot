const profileModel = require('../models/profileSchema');

module.exports = {
    name: "withdraw",
    cooldown: 5,
    aliases: ["wd"],
    description: "Withdraw money from your bank.",
    usage: ".withdraw `[amount]`",
    options: [
        {
            name: "amount",
            description: "The amount you want to withdraw from the bank",
            required: true,
            type: 4
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        const depoAmount = Number(args[0]);
        if(profileData.bank >= depoAmount) {
            const response = await profileModel.findOneAndUpdate({
                userID: message.member.id
            }, {
                $inc: {
                    coins: depoAmount,
                    bank: -depoAmount
                }
            });
            message.reply(`${message.member.displayName}, you withdrew ${depoAmount} from your bank. You now have ${profileData.bank - depoAmount} coins in your bank.`);
        } else {
            message.reply('You do not have enough coins to withdraw that much from your bank.');
        }
    }
}