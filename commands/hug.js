module.exports = {
    name: 'hug',
    cooldown: 5,
    description: "Sends a cat hug gif to someone.",
    usage: ".hug `[user mention]`",
    options: [
        {
            name: "user",
            description: "The user you want to hug",
            required: true,
            type: 6
        }
    ],
    async execute(client, message, args, Discord) {
        const person = await message.guild.members.fetch(args[0]);
        
        if(person == null) {
            message.reply('Please provide a valid user');
        } else if(person.id === message.member.id) {
            message.reply(`But.... How can you hug yourself?`)
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
            .setTitle(`Hey ${person.displayName}, ${message.member.displayName} is giving you a big hug!`)
            .setImage(catgif)
            .setFooter({text:'Today\'s hugs have been provided by Wolfer & Abby Inc.'});
            message.reply({embeds: [embed]});
        }
    }
}