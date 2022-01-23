const fs = require('fs');
const profileModel = require('../models/profileSchema');

module.exports = {
    name: "fbmute",
    cooldown: 5,
    aliases: ["fbm", "fm"],
    description: "Mute or unmute someone from sending feedback.",
    usage: ".fbmute `[tag]`",
    options: [
        {
            name: "tag",
            description: "Tag of the person you want to (un)mute (do not mention them)",
            required: true,
            type: 3
        }
    ],
    async execute(client, interaction, args, Discord, profileData) {
        const user = client.users.cache.find(u => u.tag === args[0])
        const admin = (await client.guilds.cache.get('876363041703350272').members.fetch()).get(interaction.member.id);
        if(typeof admin !== "undefined" && typeof admin.roles.cache.get("911865219091943494") !== "undefined") {
            if(typeof user !== "undefined") {
                extraData = await profileModel.findOne({ userID: user.id });
                if(!extraData) {
                    let profile = await profileModel.create({
                        userID: interaction.member.id,
                        serverID: interaction.guild.id,
                        coins: 1000,
                        bank: 0,
                        resources: {},
                        items: {},
                        equipped: "",
                        autoStats: {efficiency:0, cost:0, exp: 0, special: 0},
                        fbmuted: true
                    });
                   profile.save();
                   extraData = await profileModel.findOne({ userID: interaction.member.id });
                   interaction.reply(`User ${args[0]} has been muted!`)
                } else if (typeof extraData.fbmuted === "undefined" || !extraData.fbmuted) {
                    const response = await profileModel.findOneAndUpdate({
                        userID: user.id
                    }, {
                        $set: {fbmuted:true},
                    });
                    interaction.reply(`User ${args[0]} has been muted!`)
                } else if (extraData.fbmuted) {
                    const response = await profileModel.findOneAndUpdate({
                        userID: user.id
                    }, {
                        $set: {fbmuted:false},
                    });
                    interaction.reply(`User ${args[0]} has been unmuted!`)
                }
            } else {
                interaction.reply("That user could not be found, make sure it is the right tag and that they share a server with the bot.")
            }
        } else {
            interaction.reply("You do not have permission for this command! Only Admins on the official Starship server can use this.")
        }
    }
}