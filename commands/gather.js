const fs = require('fs');
const profileModel = require('../models/profileSchema');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);
const spotJSON = fs.readFileSync('./gatherspots.json');
const spotData = JSON.parse(spotJSON);
const toolsJSON = fs.readFileSync('./tools.json');
const toolsData = JSON.parse(toolsJSON);
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: "gather",
    cooldown: 20,
    aliases: ['g'],
    description: "Choose a location to gather from either",
    usage: ".gather {ac}",
    options: [
        {
            name: "ac",
            description: "Whether to autocomplete or not",
            required: false,
            type: 3
        }
    ],
    async execute(client, message, args, Discord, profileData) {

        var locations = [];
        for(var i = 0; i < 3; i++) {
            var tempLoc = chooseLocation(spotData["spots"]);
            if(!locations.find(element => element["name"] === tempLoc["name"])) {
                locations.push(tempLoc);
            } else {
                i--;
            }
        }

        var descriptionOne = "You hop in your starship and find a new solar system. Here you can try to gather in: \n";
        for(var i = 0; i < locations.length; i++) {
            descriptionOne += `**${i+1}**: ${locations[i]["name"]} \n`;
        }
        descriptionOne += "To choose which location to explore click on its corresponding button."

        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('option1')
                    .setLabel(locations[0].name)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('option2')
                    .setLabel(locations[1].name)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('option3')
                    .setLabel(locations[2].name)
                    .setStyle('PRIMARY')
                ]
            );
        const embed = new Discord.MessageEmbed()
        .setColor('#080885')
        .setTitle('Gather Options:')
        .setDescription(descriptionOne)
        .setFooter({text:'Today\'s options have been provided by Wolfer & Abby Inc.'});
        var firstMessage = await message.reply({embeds: [embed], components: [row], fetchReply: true})
            .catch(console.error);
        if(args[0] !== "ac") {
            const collector = firstMessage.createMessageComponentCollector({componentType: 'BUTTON', time: 20000});
            collector.on('collect', async interaction => {

                if(firstMessage.editedAt) {
                    return;
                }
                let location;
                switch(interaction.customId) {
                    case 'option1' : location = locations[0]; break;
                    case 'option2' : location = locations[1]; break;
                    case 'option3' : location = locations[2]; break;
                }


                var locationList = [];
                for(let item of resourceData["resources"]) {
                    item["chance"] = item["chance"]*location["modifiers"][item.category];
                    locationList.push(item);
                }

                const common = locationList.filter((data) => {
                    return data.rarity === "normal";
                });
                const uncommon = locationList.filter((data) => {
                    return data.rarity === "uncommon";
                });
                const great = locationList.filter((data) => {
                    return data.rarity === "great";
                });
                const rare = locationList.filter((data) => {
                    return data.rarity === "rare";
                });
                const unique = locationList.filter((data) => {
                    return data.rarity === "unique";
                });
                const epic = locationList.filter((data) => {
                    return data.rarity === "epic";
                });
                const ultra = locationList.filter((data) => {
                    return data.rarity === "ultra";
                });

                var tool = toolsData["tools"].find(element => element.id === profileData.equipped);

                const listOfResources = gathered(common, uncommon, great, rare, unique, epic, ultra, tool);

                var description = location["description"];
                {String, Number} uploadData = {};
                {String, Number} descriptionData = {};
                for(var i = 0; i < listOfResources.length; i++) {
                    if(!uploadData["resources."+listOfResources[i]["id"]]) {
                        uploadData["resources."+listOfResources[i]["id"]] = 0;
                    }
                    uploadData["resources."+listOfResources[i]["id"]]++;
                    if(!descriptionData[listOfResources[i]["id"]]) {
                        descriptionData[listOfResources[i]["id"]] = 0;
                    }
                    descriptionData[listOfResources[i]["id"]]++;
                }

                for(key in descriptionData) {
                    const emoji = client.emojis.cache.find(emoji => emoji.name === key)
                    if(typeof emoji !== "undefined") {
                    description += `${descriptionData[key]}x ${emoji}, `;
                    } else {
                        description += `${descriptionData[key]}x ${key}, `;
                    }
                }
            
                const response = await profileModel.findOneAndUpdate({
                    userID: message.member.id
                }, {
                    $inc: uploadData
                });

                const embed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('You gathered:')
                .setDescription(description)
                .setImage('https://assets.newatlas.com/dims4/default/b89cd58/2147483647/strip/true/crop/925x617+0+232/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fchandra-nasa-space-telescope-anniversary-4.jpg')
                .setFooter({text:'Today\'s gatherings have been provided by Wolfer & Abby Inc.'});
                interaction.update({embeds: [embed], components: []});
            
            });
        }

        else {
            const location = locations[0];

            var locationList = [];
            for(let item of resourceData["resources"]) {
                item["chance"] = item["chance"]*location["modifiers"][item.category];
                locationList.push(item);
            }

            const common = locationList.filter((data) => {
                return data.rarity === "normal";
            });
            const uncommon = locationList.filter((data) => {
                return data.rarity === "uncommon";
            });
            const great = locationList.filter((data) => {
                return data.rarity === "great";
            });
            const rare = locationList.filter((data) => {
                return data.rarity === "rare";
            });
            const unique = locationList.filter((data) => {
                return data.rarity === "unique";
            });
            const epic = locationList.filter((data) => {
                return data.rarity === "epic";
            });
            const ultra = locationList.filter((data) => {
                return data.rarity === "ultra";
            });

            var tool = toolsData["tools"].find(element => element.id === profileData.equipped);

            const listOfResources = gathered(common, uncommon, great, rare, unique, epic, ultra, tool);

            var description = location["description"];
            {String, Number} uploadData = {};
            {String, Number} descriptionData = {};
            for(var i = 0; i < listOfResources.length; i++) {
                if(!uploadData["resources."+listOfResources[i]["id"]]) {
                    uploadData["resources."+listOfResources[i]["id"]] = 0;
                }
                uploadData["resources."+listOfResources[i]["id"]]++;
                if(!descriptionData[listOfResources[i]["id"]]) {
                    descriptionData[listOfResources[i]["id"]] = 0;
                }
                descriptionData[listOfResources[i]["id"]]++;
            }

            for(key in descriptionData) {
                const emoji = client.emojis.cache.find(emoji => emoji.name === key)
                if(typeof emoji !== "undefined") {
                description += `${descriptionData[key]}x ${emoji}, `;
                } else {
                    description += `${descriptionData[key]}x ${key}, `;
                }
            }
        
            const response = await profileModel.findOneAndUpdate({
                userID: message.member.id
            }, {
                $inc: uploadData
            });

            const embed = new Discord.MessageEmbed()
            .setColor('#080885')
            .setTitle('You gathered:')
            .setDescription(description)
            .setImage('https://assets.newatlas.com/dims4/default/b89cd58/2147483647/strip/true/crop/925x617+0+232/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fchandra-nasa-space-telescope-anniversary-4.jpg')
            .setFooter({text:'Today\'s gatherings have been provided by Wolfer & Abby Inc.'});
            firstMessage.edit({embeds: [embed], components: []});
        }
    }
}

function gathered(common, uncommon, great, rare, unique, epic, ultra, tool) {
    var listOfResources = [];
    if(typeof tool === "undefined") {
        const amount = 1+Math.floor(3*Math.random());
        for(var i = 0; i < amount; i++) {
            const randomNumber = Math.random();
            if(randomNumber <= .80) {
                listOfResources.push(randomResource(common));
            } else if(randomNumber <= .96) {
                listOfResources.push(randomResource(uncommon));
            } else if(randomNumber <= .992) {
                listOfResources.push(randomResource(great));
            } else if(randomNumber <= .99984) {
                listOfResources.push(randomResource(rare));
            } else if(randomNumber <= .999968) {
                listOfResources.push(randomResource(unique));
            } else if(randomNumber <= .9999936) {
                listOfResources.push(randomResource(epic));
            }else {
                listOfResources.push(randomResource(ultra));
            }
        }
    } else {
        const amount = tool.amount-tool.range+Math.floor((1+tool.range*2)*Math.random());
        for(var i = 0; i < amount; i++) {
            const randomNumber = Math.random();
            if(randomNumber <= calcRarity(tool.rarities, 1)) {
                listOfResources.push(randomResource(common));
            } else if(randomNumber <= calcRarity(tool.rarities, 2)) {
                listOfResources.push(randomResource(uncommon));
            } else if(randomNumber <= calcRarity(tool.rarities, 3)) {
                listOfResources.push(randomResource(great));
            } else if(randomNumber <= calcRarity(tool.rarities, 4)) {
                listOfResources.push(randomResource(rare));
            } else if(randomNumber <= calcRarity(tool.rarities, 5)) {
                listOfResources.push(randomResource(unique));
            } else if(randomNumber <= calcRarity(tool.rarities, 6)) {
                listOfResources.push(randomResource(epic));
            }else {
                listOfResources.push(randomResource(ultra));
            }
        }
    }
    return listOfResources;

}

function randomResource(resourceList) {
    var total = 0;
    for(var i = 0; i < resourceList.length; i++) {
        total += resourceList[i]["chance"];
    }
    const randomNumber = Math.random()*total;
    var checkedSoFar = 0;
    for(var i = 0; i < resourceList.length; i++) {
        if(randomNumber <= checkedSoFar + resourceList[i]["chance"]) {
            return resourceList[i];
        }
        checkedSoFar += resourceList[i]["chance"];
    }

    return null;
    
}

function chooseLocation(spotList) {
    var total = 0;
    for(var i = 0; i < spotList.length; i++) {
        total += spotList[i]["chance"];
    }
    const randomNumber = Math.random()*total;
    var checkedSoFar = 0;
    for(var i = 0; i < spotList.length; i++) {
        if(randomNumber <= checkedSoFar + spotList[i]["chance"]) {
            return spotList[i];
        }
        checkedSoFar += spotList[i]["chance"];
    }

    return null;
}

function calcRarity(start, amount) {
    var rarity = 0;
    for(var i = 0; i < amount; i++) {
        rarity += start*Math.pow(1-start, i);
    }
    return rarity;
}
