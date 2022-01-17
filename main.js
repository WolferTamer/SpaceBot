const Discord = require('discord.js');
const client = new Discord.Client({partials : ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]});

require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.on('ready', () => {

    ['command_handler', 'event_handler'].forEach(handler => {
        require(`./handlers/${handler}`)(client, Discord);
    })
})

mongoose.connect(process.env.MONGODB_SRV, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=> {
        console.log('Connected to the database!');
    }).catch((err)=> {
        console.log(err);
    });

client.login(process.env.TOKEN);