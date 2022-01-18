const profileModel = require('../../models/profileSchema');

const cooldowns = new Map();

module.exports = async(Discord, client, interaction) => {
    if(!interaction.isCommand()) {
        return null
    }
    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: interaction.member.id });
        if(!profileData) {
            let profile = await profileModel.create({
                userID: interaction.member.id,
                serverID: interaction.guild.id,
                coins: 1000,
                bank: 0,
                resources: {},
                items: {},
                equipped: "",
                autoStats: {efficiency:0, cost:0, exp: 0, special: 0}
            });
           profile.save();
           profileData = await profileModel.findOne({ userID: interaction.member.id });
        }
    }catch(err) {
        console.log(err);
    }
    
    let upload = {autoStats: {efficiency:0, cost:0, exp: 0, special: 0}};
    if(typeof profileData.autoStats === "undefined") {
        const response = await profileModel.findOneAndUpdate({
            userID: interaction.member.id
        }, {
            $set: upload,
        });
    }

    profileData = await profileModel.findOne({ userID: interaction.member.id });

    let options = interaction.options.data;
    var args = [];
    for(var i = 0; i < options.length; i++) {
        args.push(`${options[i].value}`);
    }

    let command = client.commands.get(interaction.commandName);
    if(command) {
        if(!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Discord.Collection());
        }

        const current_time = Date.now();
        const time_stamps = cooldowns.get(interaction.commandName);
        const cooldown_amount = (interaction.commandName) * 1000;

        if(time_stamps.has(interaction.member.id)) {
            const expiration_time = time_stamps.get(interaction.member.id) + cooldown_amount;

            if(current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000;

                return interaction.reply(`please wait **${time_left.toFixed(1)}** seconds before using ${interaction.commandName} again.`).then(msg => { setTimeout(() => msg.delete(), 6000)});
            }
        }

        time_stamps.set(interaction.member.id, current_time);
        setTimeout(() => time_stamps.delete(interaction.member.id), cooldown_amount);

        try {
            if(command) command.execute(client, interaction, args, Discord, profileData);
        } catch(err) {
            console.log(err)
            console.log("Command did not exist")
        }
    }

}