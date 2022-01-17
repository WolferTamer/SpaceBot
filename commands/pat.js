module.exports = {
    name: 'pat',
    cooldown: 5,
    description: "Sends pat to someone.",
    usage: ".pat `[user mention]`",
    options: [
        {
            name: "user",
            description: "The user you want to pat",
            required: true,
            type: 6
        }
    ],
    async execute(client, message, args) {
        const person = await message.guild.members.fetch(args[0]);

        if(person == null) {
            message.reply('Please provide a valid user');
        } else if(person.id === message.member.id) {
            message.reply(`But.... How can you hug yourself?`)
        } else {
            message.reply(`Hey ${person.displayName}, you're gonna get many pats from ${message.member.displayName}! >:)`);
        }
    }
}