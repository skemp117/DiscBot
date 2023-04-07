const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
            console.log(`\u2705 ${command.data.name} command loaded`)
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);



// // This will check if the node version you are running is the required
// // Node version, if it isn't it will throw the following error to inform
// // you.
// if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
// const { token, invalidnames } = require("./config.json");

// // Load up the discord.js library
// const { Client, Intents, Collection } = require("discord.js");
// // We also load the rest of the things we need in this file:
// const { readdirSync } = require("fs");
// const logger = require("./modules/Logger.js");

// process.on('uncaughtException', err => {
//   logger.error(err)
//   process.exit(1) //mandatory (as per the Node.js docs)
// });

// // This is your client. Some people call it `bot`, some people call it `self`,
// // some might call it `cootchie`. Either way, when you see `client.something`,
// // or `bot.something`, this is what we're referring to. Your client.
// const client = new Client({ 
//     intents: [
//         Intents.FLAGS.GUILDS,
//         Intents.FLAGS.GUILD_VOICE_STATES,
//         Intents.FLAGS.GUILD_MESSAGES,
//         Intents.FLAGS.DIRECT_MESSAGES
//     ] 
// });

// // Commands are put in collections where they can be
// // read from, catalogued, listed, etc.
// const commands = new Collection();

// const homedir = __dirname;

// // To reduce client pollution we'll create a single container property
// // that we can attach everything we need to.
// client.container = {
//   commands,
//   invalidnames,
//   homedir,
//   queue: new Map() // this queue will map a unique queue to each guild ID
// };

// const init = async () => {
//   // Here we load **commands** into memory, as a collection, so they're accessible
//   // here and everywhere else.
//   const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
//   for (const file of commands) {
//     const props = require(`./commands/${file}`);
//     logger.log(`Loading Command: ${props.help.name}.`, "log");
//     client.container.commands.set(props.help.name, props);
//     client.container.invalidnames.push(props.help.name);
//   }

//   // Then we load events, which will include our message and ready event.
//   const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
//   for (const file of eventFiles) {
//     const eventName = file.split(".")[0];
//     logger.log(`Loading Event: ${eventName}.`, "log");
//     const event = require(`./events/${file}`);
//     // Bind the client to any event, before the existing arguments
//     // provided by the discord.js event. 
//     client.on(eventName, event.bind(null, client));
//   }  

//   // Be sure to leave when voice channel is empty
//   client.on('voiceStateUpdate', (oldState, newState) => {
//     const {queue} =  client.container;
//     const serverQueue = queue.get(oldState.guild.id);
//     // if nobody left the channel in question, return.
//     if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
//       return;
  
//     // otherwise, check how many people are in the channel now
//     if (!oldState.channel.members.size - 1) 
//       setTimeout(() => { // if 1 (you), wait five minutes
//         if (!oldState.channel.members.size - 1) // if there's still 1 member,
//           if (serverQueue){
//               serverQueue.songs = [];
//               serverQueue.voiceChannel.leave();
//               return queue.delete(serverQueue.voiceChannel.guild.id);
//           }
//           oldState.channel.leave(); // leave
//        }, 5000); // (5 sec in ms)
//   });

//   // Here we login the client.
//   client.login(token);

// // End top-level async/await function.
// };

// init();
