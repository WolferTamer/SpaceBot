var fs = require('fs');
const resourceJSON = fs.readFileSync('./resources.json');
const resourceData = JSON.parse(resourceJSON)["resources"];

var marketFileExists = function() {
    var d = new Date();
    return fs.existsSync(`./market_files/${d.getDate()}${d.getMonth()}${d.getFullYear()}.json`);
};

var createMarketFile = function() {
    var jsonData = [];
    var resourceLists = [];
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "normal";
    }));
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "uncommon";
    }));
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "great";
    }));
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "rare";
    }));
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "unique";
    }));
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "epic";
    }));
    resourceLists.push(resourceData.filter((data) => {
        return data.rarity === "ultra";
    }));
    for(let list in resourceLists) {
        const item = randomResource(resourceLists[list]);
        var jsonItem = {
            "name":item["name"],
            "id":item["id"]
        };
        var cost;
        if(item["rarity"] === "normal") {
            cost = 3;
        } else if(item["rarity"] === "uncommon") {
            cost = 15;
        } else if(item["rarity"] === "great") {
            cost = 75;
        } else if(item["rarity"] === "rare") {
            cost = 300;
        } else if(item["rarity"] === "unique") {
            cost = 1800;
        } else if(item["rarity"] === "epic") {
            cost = 9000;
        } else if(item["rarity"] === "ultra") {
            cost = 45000;
        }
        jsonItem["cost"] = cost;
        jsonData.push(jsonItem);
    }
    var d = new Date();
    var jsonString = JSON.stringify(jsonData);
    var nameofFile = `./market_files/${d.getDate()}${d.getMonth()}${d.getFullYear()}.json`;
    
    fs.writeFileSync(nameofFile, jsonString);
};

var getMarketFile = function() {
    var d = new Date();
    if(!marketFileExists) {
        createMarketFile();
    }

    var file = fs.readFileSync(`./market_files/${d.getDate()}${d.getMonth()}${d.getFullYear()}.json`);
    var data = JSON.parse(file);
    return data;
};

randomResource = function(resourceList) {
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

module.exports = {
    "getMarketFile": getMarketFile,
    "createMarketFile": createMarketFile,
    "marketFileExists": marketFileExists
};
