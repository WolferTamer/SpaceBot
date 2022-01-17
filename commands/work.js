const profileModel = require('../models/profileSchema');

module.exports = {
    name: "work",
    cooldown: 10,
    description: "Work to get a random amout of money.",
    usage: ".work",
    async execute(client, message, args, Discord, profileData) {
        const ranNumber = Math.floor(Math.random()*50)+1;
        const response = await profileModel.findOneAndUpdate({
            userID: message.member.id
        }, {
            $inc: {
                coins: ranNumber
            }
        });
        message.reply(`${message.member.displayName}, you worked and were paid ${ranNumber}`);
    }
}