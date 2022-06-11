const fs = require('fs');
const profileModel = require('../models/profileSchema');
const Pet = require('./../utils/pet_utils.js')

module.exports = {
    name: "setpet",
    cooldown: 5,
    aliases: ['sp'],
    description: "Choose which pet to take into exploration, combat, and gathering",
    usage: ".setpet `[pet]`",
    options: [
        {
            name: "pet",
            description: "The id or name of the pet you want to equip (prioritizes id over name)",
            required: false,
            type: 3
        }
    ],
    async execute(client, interaction, args, Discord, profileData) {
        let list = profileData.petList
        let pet = args[0]
        var petStats = list.find(element => element.id === pet);
        if(typeof petStats === "undefined") {
            var petStats = list.find(element => element.name === pet);
        }

        if(typeof petStats === "undefined") {
            petStats = list.find(element => element.id === profileData.equippedPet)
            interaction.reply(`You have ${petStats.name}, your level ${petStats.level} ${petStats.id} set as your pet.`)
        } else {
            const response = await profileModel.findOneAndUpdate({
                userID: interaction.member.id
            }, {
                $set: {
                    equippedPet: petStats.id
                }
            });
            var message = await interaction.reply(`Set ${args[0]} as your pet`);
        }
    }
}