module.exports = {
    name: 'hug',
    cooldown: 5,
    description: "Sends hug",
    usage: ".hug `[user mention]`",
    async execute(client, message, args, Discord) {
        const person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[1]))

        if(person == null) {
            message.channel.send('Please provide a valid user');
        } else if(person.id === message.author.id) {
            message.channel.send(`But.... How can you hug yourself?`)
        } else {
            var catgif = "";
            switch (Math.floor(Math.random()*4)) {
                case 0: catgif = "https://c.tenor.com/wSJZSQqIHhUAAAAC/love-cats-cat.gif"; break;
                case 1: catgif = "https://c.tenor.com/eAKshP8ZYWAAAAAM/cat-love.gif"; break;
                case 2: catgif = "https://thumbs.gfycat.com/InbornFluidBluetickcoonhound-max-1mb.gif"; break;
                case 3: catgif = "https://c.tenor.com/BeBmpmSMjDoAAAAM/cat-hug.gif"; break;
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#e650bb')
            .setTitle(`Hey ${person.user.username}, ${message.author.username} is giving you a big hug!`)
            .setImage(catgif)
            .setFooter('Today\'s hugs have been provided by Wolfer & Abby Inc.');
            message.channel.send(embed);
        }
    }
}