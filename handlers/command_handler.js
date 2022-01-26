const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9')
const fs = require('fs');
require('dotenv').config();

module.exports = async (client, Discord) => {
    var commands = []
    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    const guildId = '895168869361152021'
    const clientId = '895169494933176331'
    for(const file of commandFiles) {
        const command = require(`../commands/${file}`);

        if(command.name) {
            client.commands.set(command.name, command);
            if(typeof command.options === "undefined") {
                commands.push({name: command.name, description: command.description});
            } else {
                commands.push({name: command.name, description: command.description, options: command.options});
            }
        } else continue;
        

    }

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log('Started refreshing application commands');

            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body:commands});
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log('Successfully reloaded application commands');
        } catch(err) {
            console.error(err);
        }
    })();

    console.log("Finished loading commands")

    /*client.on('message', message => {
        if(!message.content.startsWith(process.env.PREFIX) || message.member.bot) return;

        const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(command === 'luv') {
            client.commands.get('luv').execute(message, args);
        } else if (command === 'hug') {
            client.commands.get('hug').execute(message, args);
        } else if (command === 'pat') {
            client.commands.get('pat').execute(message, args);
        } else if (command === 'kill') {
            client.commands.get('kill').execute(message, args);
        }
    });*/
}