const profileModel = require('../models/profileSchema');

module.exports = {
    name: "feedback",
    cooldown: 300,
    aliases: ["fb", "f"],
    description: "Send us feedback/bug reports. Keep in mind that your tag will be associated with this report.",
    usage: ".feedback `[report]`",
    options: [
        {
            name: "type",
            description: "Type of report. Can be bug, advice, or feedback",
            required: true,
            type: 3
        },{
            name: "report",
            description: "Advice/report you want to send the dev team",
            required: true,
            type: 3
        }
    ],
    async execute(client, interaction, args, Discord, profileData) {
        if(typeof profileData.fbmuted === "undefined" || profileData.fbmuted == false) {
            const type = args[0]
            const report = args[1]
            var reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Report from ${interaction.member.user.tag}:`)
                .setDescription(report)
            switch(type.toLowerCase()) {
                case "bug": reportEmbed = reportEmbed.setAuthor({name: 'Bug Report', iconURL: 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/exclamation-mark_2757.png'})
                .setColor([186,37,30]); break;
                case "advice" : reportEmbed = reportEmbed.setAuthor({name: 'Advice', iconURL: 'https://www.pngkit.com/png/full/24-243415_orange-question-mark-question-mark-icon-orange.png'})
                .setColor([186,92,20]); break;
                case "feedback" : reportEmbed = reportEmbed.setAuthor({name: 'Feedback', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Checkmark_green.svg/1200px-Checkmark_green.svg.png'})
                .setColor([47,158,66]); break;
                default: interaction.reply("Please enter 'bug', 'advice', or 'feedback' for the 'type' variable"); return;
            }
            let guild = client.guilds.cache.get('876363041703350272');
            let channel = await guild.channels.fetch('933514222090989608');
            channel.send({embeds: [reportEmbed]})

            var replyEmbed = new Discord.MessageEmbed()
                .setTitle(`Thank you for your help!`)
                .setDescription("This message has been sent off to our testers and developers who will try and get to it as quickly as possible. They may contact you for more info if necessary.")
                .setColor([47,158,66])

            interaction.reply({embeds: [replyEmbed]})
        } else {
            interaction.reply("You have been banned from the feedback command! If you believe this was done in error please contact administrators on the offical Startship server.")
        }
    }
}