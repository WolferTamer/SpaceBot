module.exports = {
    name: 'kill',
    cooldown: 5,
    description: "Kills someone",
    usage: ".kill `{user mention}`",
    async execute(client, message, args) {
        const person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[1]))

        if(person == null) {
            message.channel.send('Please provide a valid user');
        } else if(person.id == 321454725981798400) {
            var catgif = "";
            switch (Math.floor(Math.random()*4)) {
                case 0: catgif = "https://c.tenor.com/wSJZSQqIHhUAAAAC/love-cats-cat.gif"; break;
                case 1: catgif = "https://c.tenor.com/eAKshP8ZYWAAAAAM/cat-love.gif"; break;
                case 2: catgif = "https://thumbs.gfycat.com/InbornFluidBluetickcoonhound-max-1mb.gif"; break;
                case 3: catgif = "https://c.tenor.com/BeBmpmSMjDoAAAAM/cat-hug.gif"; break;
            }
            message.channel.send(`Sorry abby, but you only get to be killed with kindness >:) \n ${catgif}`)
        } else if(person.id === message.author.id) {
            message.channel.send(`No, you can't kill yourself`)
        } else {
            message.channel.send(`${person.user.username}, you're dead now lol, get rekt`);
        }
    }
}