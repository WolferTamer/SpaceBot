const fs = require('fs');
const profileModel = require('../models/profileSchema');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "upgrade",
    cooldown: 5,
    aliases: ["u"],
    description: "Upgrade your auto bot",
    usage: ".upgrade [skill] [amount]",
    options: [
        {
            name: "skill",
            description: "The skill you want to upgrade",
            required: true,
            type: 3
        }, {
            name: "amount",
            description: "The amount you want spend to upgrade your skill",
            required: true,
            type: 4
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        const skill = args[0];
        const amount = parseInt(args[1]);
        if(amount <= profileData.coins) {
            const skills = ["exp","special","cost","efficiency"];
            if(skills.filter(word => skill.toLowerCase() === word).length > 0) {
                var upload = {};
                upload["coins"] = -amount;
                upload[`autoStats.${skill}`] = amount;
                const response = await profileModel.findOneAndUpdate({
                    userID: message.member.id
                }, {
                    $inc: upload
                });

                message.reply(`${skill.charAt(0).toUpperCase() + skill.slice(1)} has been upgraded by ${amount} experience`)

            } else {
                message.reply("Please enter a valid skill to upgrade")
            }
        } else {
            message.reply("You do not have enough coins for that.")
        }
    }
}