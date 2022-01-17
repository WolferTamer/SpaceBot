module.exports = {
    name: 'kill',
    cooldown: 5,
    description: "Kills someone",
    usage: ".kill `{user mention}`",
    options: [
        {
            name: "user",
            description: "The user you want to kill",
            required: true,
            type: 6
        }
    ],
    async execute(client, message, args) {
        const person = await message.guild.members.fetch(args[0]);

        if(person == null) {
            message.reply('Please provide a valid user');
        } else if(person.id == 321454725981798400) {
            var catgif = "";
            switch (Math.floor(Math.random()*4)) {
                case 0: catgif = "https://c.tenor.com/wSJZSQqIHhUAAAAC/love-cats-cat.gif"; break;
                case 1: catgif = "https://c.tenor.com/eAKshP8ZYWAAAAAM/cat-love.gif"; break;
                case 2: catgif = "https://thumbs.gfycat.com/InbornFluidBluetickcoonhound-max-1mb.gif"; break;
                case 3: catgif = "https://c.tenor.com/BeBmpmSMjDoAAAAM/cat-hug.gif"; break;
            }
            message.reply(`Sorry abby, but you only get to be killed with kindness >:) \n ${catgif}`)
        } else if(person.id === message.member.id) {
            message.reply(`No, you can't kill yourself`)
        } else {
            message.reply(`${person.displayName}, you're dead now lol, get rekt`);
        }
    }
}