const fs = require('fs');
const profileModel = require('../models/profileSchema');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON);

module.exports = {
    name: "autogather",
    cooldown: 5,
    aliases: ['ag'],
    description: "Automatically gather items over time",
    usage: ".gather {ac} \n`(location choice)`",
    options: [
        {
            name: "amount",
            description: "The amount you want to spend on gathering resources",
            required: false,
            type: 4
        }
    ],
    async execute(client, message, args, Discord, profileData) {
        const d = new Date();
        if(profileData.autoToComplete != 0 && profileData.timeAutoStarted+profileData.autoToComplete <= d.getTime()) {
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


            const listOfResources = gathered(common, uncommon, great, rare, unique, epic, ultra, profileData.autoToComplete/2000);
    
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
            const response = await profileModel.findOneAndUpdate({
                userID: message.member.id
            }, {
                $inc: uploadData,
                $set: {autoToComplete: 0}
            });
    
            const embed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('Your auto gathered:')
                .setDescription(description)
                .setFooter({text:'Today\'s gatherings have been provided by Wolfer & Abby Inc.'});
            message.reply({embeds: [embed]});
        }

        else if(typeof args[0] !== "undefined") {
            const amountToSpend = parseInt(args[0]);
            if(amountToSpend != NaN && amountToSpend > 0) {
                let time = d.getTime();
                let timeComplete = 1000*amountToSpend;
                var hours = timeComplete/3.6e6 | 0;
                var mins  = timeComplete%3.6e6 / 6e4 | 0;
                var secs  = Math.round(timeComplete%6e4 / 1e3);
                
                const response = await profileModel.findOneAndUpdate({
                    userID: message.member.id
                }, {
                    $set: {
                        timeAutoStarted: time,
                        autoToComplete: timeComplete
                    },
                    $inc: {
                        coins: -amountToSpend
                    }
                });

                var description = `Your auto has been set out! It will return in ${hours} hours, ${mins} minutes, ${secs} seconds with ${amountToSpend/2} resources`;
                const embed = new Discord.MessageEmbed()
                    .setColor('#080885')
                    .setTitle('AutoGather')
                    .setDescription(description)
                    .setFooter({text:'Today\'s gatherings have been provided by Wolfer & Abby Inc.'});
                message.reply({embeds: [embed]});
            }
        } else {
            var description = `This will be filled with bot levels/info soon`;
            
            var embed = new Discord.MessageEmbed()
                .setColor('#080885')
                .setTitle('AutoGather')
                .setDescription(description)
            if(profileData.autoToComplete !=0) {
                let time = d.getTime();
                let timeComplete = profileData.autoToComplete-(time-profileData.timeAutoStarted);
                var hours = timeComplete/3.6e6 | 0;
                var mins  = timeComplete%3.6e6 / 6e4 | 0;
                var secs  = Math.round(timeComplete%6e4 / 1e3);
                embed = embed.setFooter({text:`Your auto has been set out! It will return in ${hours} hours, ${mins} minutes, ${secs} seconds with ${profileData.autoToComplete/2000} resources`});
            }
            message.reply({embeds: [embed]});
        }

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
