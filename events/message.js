const {prefix,DATA_DIR,AUDIO_DIR,CHILD_DIR,GROUP_DIR} = require("../config.json");
const logger = require("../modules/Logger.js");
const { existsSync, mkdirSync,readFileSync,writeFileSync } = require("fs");
const { join } = require('path');
// var lastcmd = null;

module.exports = async (client, message) => {
    // Grab the container from the client to reduce line length.
  const { container } = client;
  const {homedir} = client.container;
  const gid = message.guild.id;
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  // Check if directory exists for the guild in the database, if not, create guild folders in database
  if (!existsSync(join(homedir,DATA_DIR,gid))) {
    mkdirSync(join(homedir,DATA_DIR,gid));
    mkdirSync(join(homedir,DATA_DIR,gid,AUDIO_DIR));
    mkdirSync(join(homedir,DATA_DIR,gid,AUDIO_DIR,CHILD_DIR));
    mkdirSync(join(homedir,DATA_DIR,gid,AUDIO_DIR,GROUP_DIR));
  }
  const ignore_path = join(homedir,DATA_DIR,gid,'guildIgnores.json');
  if (!existsSync(ignore_path)){
      writeFileSync(ignore_path,JSON.stringify([]));
  }
  ignorethese = JSON.parse(readFileSync(ignore_path))
  for (const ic of ignorethese){
    if (message.content.startsWith(`${prefix}${ic}`)) return;
  }

  const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
  const command = args.shift();
  const cmd = container.commands.get(command);

  // //Ignore command for a short TIMEOUT if we are recieving too many at a time
  // if (!lastcmd){
  //   lastcmd = Date.now()
  // }else if (Date.now()-lastcmd < TIMEOUT){
  //   return logger.log("Command timeout breached","error");
  // }
  // lastcmd = Date.now();

  if (cmd) { 
    try {
        await cmd.run(client, message, args);
      } catch (e) {
        logger.error(e);
        message.channel.send({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\`` })
          .catch(e => logger.error("An error occurred replying on an error"));
      }
  } else { //if a registered command isnt entered, default to playFile
    try {
        await container.commands.get("play").run(client, message, [].concat("playFile",command,args));
    } catch (e) {
        logger.error(e);
        message.channel.send({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\`` })
            .catch(e => logger.error("An error occurred replying on an error"));
    }
    return;
  }
}