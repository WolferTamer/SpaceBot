module.exports = {
    name: 'luv',
    cooldown: 5,
    description: "Sends luv to someone",
    usage: ".luv `[user mention]`",
    options: [
        {
            name: "user",
            description: "The user you want to luv",
            required: true,
            type: 6
        }
    ],
    async execute(client, message, args) {
        const person = await message.guild.members.fetch(args[0]);

        if(person == null) {
            message.reply('Please provide a valid user');
        } else if(person.id === message.member.id) {
            message.reply(`I'm glad you love yourself :)`)
        } else {
            message.reply(`${person.displayName}, hey! ${message.member.displayName} loves you!`);
        }
    }
}