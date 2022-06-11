const profileModel = require('../models/profileSchema');
const Pet = require('./../utils/pet_utils.js')

module.exports = {
    name: "pets",
    cooldown: 5,
    description: "See a list of your pets or see a description of a pet you own",
    usage: ".pets `{petID}`",
    needExtras: true,
    options: [
        {
            name: "petid",
            description: "The id of the pet you want to see the stats of",
            required: false,
            type: 3
        },
        {
            name: "user",
            description: "The user to get the inventory of. Leave blank to see your inventory.",
            required: false,
            type: 6
        }
    ],
    async execute(client, interaction, args, Discord, profileData) {
        var temp;
        var user;
        for(var i = 0; i < args.length; i++) {
            if (args[i].name === "user") {
                temp = args[i].value;
            }
        }
        if(typeof temp !== "undefined") {
            user = await interaction.guild.members.fetch(temp);
            try {
                profileData = await profileModel.findOne({ userID: user.id });
            } catch (err) {
                console.log(err);
            }
        } else {
            user = interaction.user;
        }
        if(typeof profileData.petList === "undefined") {
            const response = await profileModel.findOneAndUpdate({
                userID: user.id
            }, {
                $set: { petList: [], equippedPet: ""}
            });
            profileData = await profileModel.findOne({ userID: user.id });
        }

        let list = profileData.petList
        var petid;
        for(var i = 0; i < args.length; i++) {
            if (args[i].name === "petid") {
                petid = args[i].value;
            }
        }

        if(typeof petid !== "undefined") {
            var petStats = list.find(element => element.id === petid);
            if(typeof petStats !== "undefined") {
                var pet = Pet.createPet(petStats.name, petStats.id, petStats.level)
                if(pet != null) {
                    let description = pet.getDescription()
                    var embed = new Discord.MessageEmbed()
                    .setColor('#080885')
                    .setTitle(`${petStats.name} (lvl ${petStats.level} ${petStats.id}):`)
                    .setDescription(description)
                    .setFooter({text:'Pets'});
                    var sentMessage = await interaction.reply({embeds: [embed]}) 
                }
            } else {
                var pet = Pet.createPet("lol", petid, 1)
                if(pet != null) {
                    interaction.reply("You don't own that pet!")
                } else {
                    interaction.reply("That pet doesn't exist!")
                }
            }
        } else {
            if(list.length == 0) {
                interaction.reply("You don't own any pets yet!")
            } else {
                var description = ""
                for(var i = 0; i < list.length; i++) {
                    description += `${list[i].name}: level ${list[i].level} ${list[i].id}\n`
                }
                var embed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle(`Pets:`)
                .setDescription(description)
                .setFooter({text:'Cool'});
                var sentMessage = await interaction.reply({embeds: [embed]}) 
            }
        }
    }
}