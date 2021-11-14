const profileModel = require('../../models/profileSchema');

const cooldowns = new Map();

module.exports = async(Discord, client, message) => {

    if(!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
    
    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if(!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                coins: 1000,
                bank: 0,
                resources: {},
                items: {},
                equipped: ""
            });
           profile.save();
           profileData = await profileModel.findOne({ userID: message.author.id });
        }
    }catch(err) {
        console.log(err);
    }

    try {
        if(typeof profileData.resources.get("sDust") !== "undefined") {
            let dustAmount = profileData.resources.get("sDust");
            const response = await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $unset: {
                    resources: {sDust: ""}
                }
            });
            const res = await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $set: {
                    resources: {rStarDust:dustAmount}
                }
            });
        }
    } catch(err) {
        console.log(err);
    }

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    if(command) {
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const current_time = Date.now();
        const time_stamps = cooldowns.get(command.name);
        const cooldown_amount = (command.cooldown) * 1000;

        if(time_stamps.has(message.author.id)) {
            const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

            if(current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000;

                return message.reply(`please wait **${time_left.toFixed(1)}** seconds before using ${command.name} again.`).then(msg => { setTimeout(() => msg.delete(), 6000)});
            }
        }

        time_stamps.set(message.author.id, current_time);
        setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

        try {
            if(command) command.execute(client, message, args, Discord, profileData);
        } catch(err) {
            console.log("Command did not exist")
        }
    }

}