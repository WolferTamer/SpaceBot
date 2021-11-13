const fs = require('fs');

module.exports = (client, Discord) => {
    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for(const file of commandFiles) {
        const command = require(`../commands/${file}`);

        if(command.name) {
            client.commands.set(command.name, command);
        } else continue;

    }

    /*client.on('message', message => {
        if(!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

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