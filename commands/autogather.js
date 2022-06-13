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
    category: "Gathering",
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

        var efflvl = 0;
        var efftot = 0;
        var effnext = 0;
        for(var i = 0; i <= profileData.autoStats.get("efficiency"); i+=(100*Math.pow(2,efflvl))) {
            efflvl++
            efftot = i;
            effnext = Math.round(100*Math.pow(2,efflvl));
        }
        var costlvl = 0;
        var costtot = 0;
        var costnext = 0;
        for(var i = 0; i <= profileData.autoStats.get("cost"); i+=(100*Math.pow(3,costlvl))) {
            costlvl++
            costtot = i;
            costnext = Math.round(100*Math.pow(3,costlvl));
        }
        var explvl = 0;
        var exptot = 0;
        var expnext = 0;
        for(var i = 0; i <= profileData.autoStats.get("exp"); i+=(100*Math.pow(2,explvl))) {
            explvl++
            exptot = i;
            expnext = Math.round(100*Math.pow(2,explvl));
        }
        var speciallvl = 0;
        var specialtot = 0;
        var specialnext = 0;
        for(var i = 0; i <= profileData.autoStats.get("special"); i+=(100*Math.pow(2,speciallvl))) {
            speciallvl++
            specialtot = i;
            specialnext = Math.round(100*Math.pow(2,speciallvl));
        }

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


            const listOfResources = gathered(common, uncommon, great, rare, unique, epic, ultra, Math.round(profileData.autoToComplete/(360000/efflvl)));
    
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
                .setColor('#49bf49')
                .setTitle('Your drone returns to the hub, its storage container has been filled. It holds:')
                .setDescription(description)
                .setFooter({text:'Today\'s gatherings have been provided by Wolfer & Abby Inc.'});
            message.reply({embeds: [embed]});
        }

        else if(typeof args[0] !== "undefined") {
            const amountToSpend = parseInt(args[0]);
            if(amountToSpend != NaN && amountToSpend > 0 && amountToSpend <= profileData.coins) {
                let time = d.getTime();
                let timeComplete = 300000*amountToSpend/(21-costlvl);
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

                var description = `Your gatherer drone takes off from the space hub and shoots into the stars! It will return in ${hours} hours, ${mins} minutes, ${secs} seconds with ${Math.round(timeComplete/(360000/efflvl))} resources`;
                const embed = new Discord.MessageEmbed()
                    .setColor('#2228bf')
                    .setTitle('AutoGather')
                    .setDescription(description)
                    .setFooter({text:'Today\'s gatherings have been provided by Wolfer & Abby Inc.'});
                message.reply({embeds: [embed]});
            }
        } else {
            
            var description = `Efficiency: \`LVL ${efflvl} | XP ${profileData.autoStats.get("efficiency")-efftot}/${effnext}\` ${efflvl*10} resources per hour
            Cost: \`LVL ${costlvl} | XP ${profileData.autoStats.get("cost")-costtot}/${costnext}\` ${21-costlvl} dollars per 5 minutes
            Experience: \`LVL ${explvl} | XP ${profileData.autoStats.get("exp")-exptot}/${expnext}\` ${8+2*explvl} exp per resource
            Special: \`LVL ${speciallvl} | XP ${profileData.autoStats.get("special")-specialtot}/${specialnext}\` ${0.5+0.5*speciallvl}% chance for a special item`;
            
            var embed = new Discord.MessageEmbed()
                .setColor('#bf0f0f')
                .setTitle('AutoGather')
                .setDescription(description)
            if(profileData.autoToComplete !=0) {
                let time = d.getTime();
                let timeComplete = profileData.autoToComplete-(time-profileData.timeAutoStarted);
                var hours = timeComplete/3.6e6 | 0;
                var mins  = timeComplete%3.6e6 / 6e4 | 0;
                var secs  = Math.round(timeComplete%6e4 / 1e3);
                embed = embed.setFooter({text:`Your drone has already been sent out! It will return in ${hours} hours, ${mins} minutes, ${secs} seconds with ${Math.round(profileData.autoToComplete/(360000/efflvl))} resources`});
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
