// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
const { token, invalidnames } = require("./config.json");

// Load up the discord.js library
const { Client, Intents, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const logger = require("./modules/Logger.js");

process.on('uncaughtException', err => {
  logger.error(err)
  process.exit(1) //mandatory (as per the Node.js docs)
});

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();

const homedir = __dirname;

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  commands,
  invalidnames,
  homedir,
  queue: new Map() // this queue will map a unique queue to each guild ID
};

const init = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
  for (const file of commands) {
    const props = require(`./commands/${file}`);
    logger.log(`Loading Command: ${props.help.name}.`, "log");
    client.container.commands.set(props.help.name, props);
    client.container.invalidnames.push(props.help.name);
  }

  // Then we load events, which will include our message and ready event.
  const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}.`, "log");
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    client.on(eventName, event.bind(null, client));
  }  

  // Be sure to leave when voice channel is empty
  client.on('voiceStateUpdate', (oldState, newState) => {
    // if nobody left the channel in question, return.
    if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
      return;
  
    // otherwise, check how many people are in the channel now
    if (!oldState.channel.members.size - 1) 
      setTimeout(() => { // if 1 (you), wait five minutes
        if (!oldState.channel.members.size - 1) // if there's still 1 member, 
           oldState.channel.leave(); // leave
       }, 5000); // (5 sec in ms)
  });

  // Here we login the client.
  client.login(token);

// End top-level async/await function.
};

init();
