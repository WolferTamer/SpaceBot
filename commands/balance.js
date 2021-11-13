const profileModel = require('../models/profileSchema');

module.exports = {
    name: "balance",
    cooldown: 5,
    aliases: ['bal', 'money', 'b'],
    description: "Check your balance",
    usage: ".balance",
    async execute(client, message, args, Discord, profileData) {
        message.channel.send(`:moneybag: | You have **${profileData.coins}** coins in your wallet.\n:bank: | You have **${profileData.bank}** coins in your bank.`);
    }
}