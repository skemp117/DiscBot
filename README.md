# DiscBot
This is a Discord bot that works like a soundboard. It is designed to run efficiently on lightweight hardware. This bot uses node v16 and discord.js v12.

Don't want to host by yourself? Want better performance? [Donate here](https://ko-fi.com/skemp117) and I can buy a new server!

## Register your Bot with Discord
1. Go to the [Discord dev portal] (https://discord.com/developers/applications)
2. Give your application a name and click **Create**
3. Click **Bot** tab on the left sidebar, then click **Add Bot**

## Install bot on Raspberry Pi
First make sure you have piOs installed and get the link to the correct node js download for you. DiscBot uses node v16. You can check which version you need by running the command "uname -m." It'll come out something like ARVv7. The link will look something like: https://unofficial-builds.nodejs.org/download/release/v16.13.2/node-v16.13.2-linux-armv6l.tar.xz In the link is the node filename: node-v16.13.2-linux-armv6l.

ssh into the bot and use the following commands.
```
cd ~/Downloads
wget <link-to-node-download>
tar xvfJ <node-filename>.tar.xz
sudo cp -R <node-filename>/* /usr/local
rm -rf node-*
sudo apt update
sudo apt install -y ffmpeg
sudo npm install pm2 -g

cd ~/DiscBot
npm install
```

note: @discordjs/opus may take a while to install. Just be patient.

## Link your bot
1. Go to the [Discord dev portal] (https://discord.com/developers/applications)
2. Click **Bot** tab on the left sidebar, then click **Copy** under the TOKEN section.
3. Paste the token in the token field in "example_config.json" [at this point you can also edit the YT_KEY field with your YouTube Data API v3 key]
4. Rename "example_config.json" to "config.json"


## Start your bot
These commands will start your bot and restart it if it crashes. They will also start the bot on startup.
```
pm2 start index.js --name DiscBot
pm2 startup
Copy and paste pm2 startup suggested command
pm2 save
```

## Add Bot to your Guild
1. Go to the **OAuth2** tab on the left sidebar of the [Discord dev portal] (https://discord.com/developers/applications) and click the **URL Generator** submenu.
2. Select the scopes: **bot**
3. Select the permissions: **Send Messages**, **Connect**, and **Speak**
4. Follow the generated URL!

## Support
This project took a lot of time and effort. I will continute to work on it if people submit issues. Please feel free to [support me](https://ko-fi.com/skemp117)
