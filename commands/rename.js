const profileModel = require('../models/profileSchema');
const Pet = require('./../utils/pet_utils.js')

module.exports = {
    name: "rename",
    cooldown: 5,
    description: "Rename a pet you own",
    usage: ".rename `[petID]` `[name]`",
    options: [
        {
            name: "petid",
            description: "The id of the pet you want to rename",
            required: true,
            type: 3
        },
        {
            name: "name",
            description: "What to rename your pet to",
            required: true,
            type: 3
        }
    ],
    async execute(client, interaction, args, Discord, profileData) {
        if(typeof profileData.petList === "undefined") {
            const response = await profileModel.findOneAndUpdate({
                userID: interaction.user.id
            }, {
                $set: { petList: [], equippedPet: ""}
            });
            profileData = await profileModel.findOne({ userID: interaction.user.id });
        }
        var list = profileData.petList
        var found = false;
        var oldname;
        for(var i = 0; i < list.length; i++) {
            if(list[i].id === args[0]) {
                oldname = list[i].name
                list[i].name = args[1]
                found = true
                break;
            }
        }
        if(found) {
            const response = await profileModel.findOneAndUpdate({
                userID: interaction.user.id
            }, {
                $set: { petList: list}
            });

            interaction.reply(`Renamed ${oldname} to ${args[1]}`)
        } else {
            interaction.reply("That pet was not found in your zoo")
        }
    }
}