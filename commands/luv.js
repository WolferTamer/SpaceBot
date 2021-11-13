module.exports = {
    name: 'luv',
    cooldown: 5,
    description: "Sends luv",
    usage: ".luv `[user mention]`",
    async execute(client, message, args) {
        const person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[1]))

        if(person == null) {
            message.channel.send('Please provide a valid user');
        } else if(person.id === message.author.id) {
            message.channel.send(`I'm glad you love yourself :)`)
        } else {
            message.channel.send(`${person.user.username}, hey! ${message.author.username} loves you!`);
        }
    }
}