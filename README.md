# DiscBot
This is a Discord bot that works like a soundboard. It is designed to run efficiently on lightweight hardware. This bot uses node v16 and discord.js v12.

Don't want to host by yourself? Want better performance? [Donate here](https://ko-fi.com/skemp117) and I can buy a new server!

## Creating Discord bot on the Discord developer portal

## Instructions for Raspberry Pi
First make sure you have piOs installed. ssh into the bot and use the following commands.
```
cd ~/Downloads
wget https://unofficial-builds.nodejs.org/download/release/v16.13.2/node-v16.13.2-linux-armv6l.tar.xz
tar xvfJ node-v16.13.2-linux-armv6l.tar.xz
sudo cp -R node-v16.13.2-linux-armv6l/* /usr/local
rm -rf node-*
sudo apt update
sudo apt install -y ffmpeg
cd ~/DiscBot
npm init --yes
npm i --verbose discord.js@12.5.3
npm i --verbose node-opus
npm install fluent-ffmpeg
npm install ytdl-core
npm install request
npm install get-youtube-title
npm install get-youtube-id
npm install colorette
npm install @sapphire/time-utilities
sudo npm install pm2 -g
pm2 start index.js --name DiscBot
pm2 startup
Copy and paste pm2 startup suggested command
pm2 save
npm install
node .
```

After that, just change the token in the config file to the token of your bot.

## Support
This project took a lot of time and effort. I will continute to work on it if people submit issues. Please feel free to [support me](https://ko-fi.com/skemp117)
