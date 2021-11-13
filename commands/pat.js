module.exports = {
    name: 'pat',
    cooldown: 5,
    description: "Sends pat",
    usage: ".pat `[user mention]`",
    async execute(client, message, args) {
        const person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[1]))

        if(person == null) {
            message.channel.send('Please provide a valid user');
        } else if(person.id === message.author.id) {
            message.channel.send(`But.... How can you hug yourself?`)
        } else {
            message.channel.send(`Hey ${person.user.username}, you're gonna get many pats from ${message.author.username}! >:)`);
        }
    }
}