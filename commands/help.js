const profileModel = require('../models/profileSchema');
const fs = require('fs');

module.exports = {
    name: "help",
    cooldown: 5,
    aliases: ['h'],
    description: "Lists all commands or gives information on a specific command",
    usage: ".help `{command name}`",
    options: [
        {
            name: "command",
            description: "The name of the command you want more info on",
            required: false,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
        var description = "";
        var title = "";
        var commandName = commandFiles.find(element => element.substring(0,element.length-3) === args[0]);
        if(typeof commandName !== "undefined") {
            commandName = commandName.substring(0,commandName.length-3);

            const command = require(`../commands/${commandName}`);
            title = command.name;
            description+=""+command.description+"\n";

            if(typeof command.usage !== "undefined") {
                description+="**Usage:**\n"+command.usage+"\n";
            }
            if(typeof command.aliases !== "undefined") {
                description+="**Aliases:**\n";
                for(alias in command.aliases) {
                    description+="- "+command.aliases[alias]+"\n";
                }
            }

        } else {
            title = "Commands:";
            for(const file of commandFiles) {
                const command = require(`../commands/${file}`);

                description+="- "+command.name +"\n";

            }
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#2228bf')
            .setTitle(title)
            .setDescription(description)
            .setFooter({text:'[] = required argument, {} = optional argument, () = additional dialogue'});
        message.reply({embeds: [embed]});
    }
}