const profileModel = require('../models/profileSchema');

module.exports = {
    name: "balance",
    cooldown: 5,
    aliases: ['bal', 'money', 'b'],
    description: "Check your balance in both your wallet and bank",
    category: "Economy",
    usage: ".balance",
    async execute(client, message, args, Discord, profileData) {
        message.reply(`:moneybag: | You check what you have on you and find **${profileData.coins}** coins.\n:bank: | You find you have **${profileData.bank}** coins in your bank.`);
    }
}