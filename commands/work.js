const profileModel = require('../models/profileSchema');

module.exports = {
    name: "work",
    cooldown: 10,
    description: "Work for some money",
    usage: ".work",
    async execute(client, message, args, Discord, profileData) {
        const ranNumber = Math.floor(Math.random()*50)+1;
        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id
        }, {
            $inc: {
                coins: ranNumber
            }
        });
        message.channel.send(`${message.author.username}, you worked and were paid ${ranNumber}`);
    }
}