const profileModel = require('../models/profileSchema');

module.exports = {
    name: "daily",
    cooldown: 5,
    aliases: ['d'],
    description: "Claim your daily reward",
    usage: ".daily",
    category: "Misc",
    async execute(client, interaction, args, Discord, profileData) {
        const temp = new Date();
        const d = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), 0, 0, 0, 0);
        const day = d.getTime();
        if(day > profileData.lastDaily) {
            const amount = 100+(profileData.dailyStreak*25);
            if(amount > 2000) {
                amount = 2000;
            }
            const upload = {"items.nLootbox": 1, dailyStreak: 1, coins: amount};
            const response = await profileModel.findOneAndUpdate({
                userID: interaction.member.id
            }, {
                $set: {lastDaily: temp.getTime()},
                $inc: upload
            });

            var diff = (d.getTime()+86400000) - temp.getTime();
            diff = Math.abs(diff);
            var hours = diff/3.6e6 | 0;
            var mins  = diff%3.6e6 / 6e4 | 0;
            var secs  = Math.round(diff%6e4 / 1e3);

            const embed = new Discord.MessageEmbed()
            .setColor("#2228bf")
            .setTitle(':tada: Daily :tada:')
            .setDescription(`You have collected your daily! You gained ${amount} coins and 1 lootbox! :partying_face:`)
            .setFooter(`You can claim your next daily in ${z(hours)}:${z(mins)}:${z(secs)}`)
            interaction.reply({embeds: [embed]});
        } else {
            function z(n) {
                return (n < 10? '0' : '') + n;
            }

            var diff = (d.getTime()+86400000) - temp.getTime();
            diff = Math.abs(diff);
            var hours = diff/3.6e6 | 0;
            var mins  = diff%3.6e6 / 6e4 | 0;
            var secs  = Math.round(diff%6e4 / 1e3);
            interaction.reply(`You can claim your next daily in ${z(hours)}:${z(mins)}:${z(secs)}`);
        }
    }
}