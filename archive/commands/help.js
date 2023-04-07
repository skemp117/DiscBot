/*
The help command is used to display every command's name and description
to the user, so that they may see what commands are available. If a command name is given with the
help command, its extended help is shown.
*/
const {prefix} = require("../config.json");

exports.run = (client, message, args) => {
  const { container } = client;
  let output = `Commands and their arguments given as:\n**!command <required_arg>** *<optional_arg>* (condition)\n\n`;
  if (!args[0]) {
    commands = container.commands;
    commands.forEach( c => {
      output += `**${prefix}${c.help.name}** ${c.help.args}\n`;
    });
    output += `\nFor help on a specific command, type **${prefix}help <command>**\n`;
    message.channel.send(output,{ split: true });
  } else {
    // Show individual command's help.
    let command = args[0];
    if (container.commands.has(command)) {
      c = container.commands.get(command);
      message.channel.send(`**${prefix}${c.help.name}** \n${c.help.description}\nUsage: **${prefix}${c.help.name}** ${c.help.args}`);
    } else return message.channel.send("No command with that name, or alias exists.");
  };
}

exports.help = {
  name: "help",
  description: "Displays all the available commands",
  args: `*<command>*`
};