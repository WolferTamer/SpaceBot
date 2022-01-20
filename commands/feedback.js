const profileModel = require('../models/profileSchema');

module.exports = {
    name: "feedback",
    cooldown: 300,
    aliases: ["fb", "f"],
    description: "Send us feedback/bug reports.",
    usage: ".feedback `[report]",
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
        const type = args[0]
        const report = args[1]
        var reportEmbed = new Discord.MessageEmbed()
            .setColor([47,158,66])
            .setTitle(`Report from ${interaction.member}:`)
            .setDescription(report)
        switch(type.toLowerCase()) {
            case "bug": reportEmbed = reportEmbed.setAuthor({name: 'Bug Report', iconURL: 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/exclamation-mark_2757.png'}); break;
            case "advice" : reportEmbed = reportEmbed.setAuthor({name: 'Advice', iconURL: 'https://www.pngkit.com/png/full/24-243415_orange-question-mark-question-mark-icon-orange.png'}); break;
            case "feedback" : reportEmbed = reportEmbed.setAuthor({name: 'Feedback', iconURL: 'https://www.venzagroup.com/wp-content/uploads/transparent-green-checkmark-md.png'}); break;
        }
        let guild = client.guilds.cache.get('876363041703350272');
        let channel = await guild.channels.fetch('933514222090989608');
        channel.send({embeds: [reportEmbed]})

        interaction.reply("Thank you for your feedback! It has been sent off to our developers. We appreciate all the help we can get!")
    }
}