# SpaceBot

SpaceBot is a Discord bot game built using discord.js. It centers around gathering materials to create new tools which you then use to find and collect various aliens.

## Compiling and Running
### Compiling
1. Clone the repository
2. Cd into the repository and run ```npm install```.
3. Create a ```.env``` file in the top level directory with the contents:
```env
PREFIX = {prefix}
MONGODB_SRV = {mongo db server access link}
TOKEN = {discord api token}
```
### Running
Run the bot using ```node .``` in the top level directory.