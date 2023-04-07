/*
The playFile command is used to play an audio file uploaded by the guild.
It does not need a command name to be called. This is just here for the help function
*/

exports.help = {
  name: "<file_or_group>",
  description: `Plays audio file when name of an audio file is called at volume specified by the volume multiplier. The volume it plays at is the file's original volume times the volume multiplier`,
  args: `*<volume_multiplier(between 0-2)>*`
};