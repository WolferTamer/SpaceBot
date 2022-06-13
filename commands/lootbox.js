const fs = require('fs');
const profileModel = require('../models/profileSchema');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "lootbox",
    cooldown: 5,
    aliases: ['lb'],
    description: "Open a lootbox",
    usage: ".lootbox {amount} {rarity}",
    options: [
        {
            name: "amount",
            description: "The amount of lootboxes to open. Typing 'all' will open all of the relevant type",
            required: false,
            type: 4
        }, {
            name: "rarity",
            description: "The rarity of the lootbox you want to open",
            required: false,
            type: 3
        }
    ],
    async execute(client, interaction, args, Discord, profileData) {
        var amountToOpen;
        if (profileData.items.get("nLootbox") <= 0){
            interaction.reply("You do not have any lootboxes.")
            return;
        } else if (typeof args[0] === "undefined") {
            amountToOpen = 1;
        } else if (args[0] < 1) {
            interaction.reply("Please enter a positive integer.")
            return;
        } else if (args[0] <= profileData.items.get("nLootbox")) {
            amountToOpen = args[0];
        } else if (profileData.items.get("nLootbox") > 0) {
            amountToOpen = profileData.items.get("nLootbox");
        }

        const common = resourceData["resources"].filter((data) => {
            return data.rarity === "normal";
        });
        const uncommon = resourceData["resources"].filter((data) => {
            return data.rarity === "uncommon";
        });
        const great = resourceData["resources"].filter((data) => {
            return data.rarity === "great";
        });
        const rare = resourceData["resources"].filter((data) => {
            return data.rarity === "rare";
        });
        const unique = resourceData["resources"].filter((data) => {
            return data.rarity === "unique";
        });
        const epic = resourceData["resources"].filter((data) => {
            return data.rarity === "epic";
        });
        const ultra = resourceData["resources"].filter((data) => {
            return data.rarity === "ultra";
        });
        var totalAmount = 0;
        for(var i = 0; i < amountToOpen; i++) {
            totalAmount += (20 + Math.floor(Math.random()*11));
        }
        const listOfResources = gathered(common, uncommon, great, rare, unique, epic, ultra, totalAmount);

        var description = "";
        { String, Number } uploadData = {};
        { String, Number } descriptionData = {};
        for (var i = 0; i < listOfResources.length; i++) {
            if (!uploadData["resources." + listOfResources[i]["id"]]) {
                uploadData["resources." + listOfResources[i]["id"]] = 0;
            }
            uploadData["resources." + listOfResources[i]["id"]]++;
            if (!descriptionData[listOfResources[i]["id"]]) {
                descriptionData[listOfResources[i]["id"]] = 0;
            }
            descriptionData[listOfResources[i]["id"]]++;
        }

        for (key in descriptionData) {
            const emoji = client.emojis.cache.find(emoji => emoji.name === key)
            if (typeof emoji !== "undefined") {
                description += `${descriptionData[key]}x ${emoji}, `;
            } else {
                description += `${descriptionData[key]}x ${key}, `;
            }
        }
        uploadData["items.nLootbox"] = -amountToOpen
        const response = await profileModel.findOneAndUpdate({
            userID: interaction.member.id
        }, {
            $inc: uploadData
        });

        const embed = new Discord.MessageEmbed()
            .setColor('#2228bf')
            .setTitle(`Your lootboxes gave you ${totalAmount} resources:`)
            .setDescription(description)
        interaction.reply({ embeds: [embed] });
    }
}

function gathered(common, uncommon, great, rare, unique, epic, ultra, amount) {
    var listOfResources = [];

    for (var i = 0; i < amount; i++) {
        const randomNumber = Math.random();
        if (randomNumber <= .80) {
            listOfResources.push(randomResource(common));
        } else if (randomNumber <= .96) {
            listOfResources.push(randomResource(uncommon));
        } else if (randomNumber <= .992) {
            listOfResources.push(randomResource(great));
        } else if (randomNumber <= .99984) {
            listOfResources.push(randomResource(rare));
        } else if (randomNumber <= .999968) {
            listOfResources.push(randomResource(unique));
        } else if (randomNumber <= .9999936) {
            listOfResources.push(randomResource(epic));
        } else {
            listOfResources.push(randomResource(ultra));
        }
    }
    return listOfResources;

}

function randomResource(resourceList) {
    var total = 0;
    for (var i = 0; i < resourceList.length; i++) {
        total += resourceList[i]["chance"];
    }
    const randomNumber = Math.random() * total;
    var checkedSoFar = 0;
    for (var i = 0; i < resourceList.length; i++) {
        if (randomNumber <= checkedSoFar + resourceList[i]["chance"]) {
            return resourceList[i];
        }
        checkedSoFar += resourceList[i]["chance"];
    }

    return null;

}