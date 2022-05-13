
/*
The play command is used to play youtube video uploaded by the guild.
*/
const { executePlayYT,executePlayFile,createServerQueue} = require("../modules/functions.js");
const resume = require("./resume.js")

exports.run = async (client, message, args) => {
    const voiceChannel = message.member.voice.channel;
    const gid = message.guild.id;
    const {queue} = client.container;
    let serverQueue = queue.get(gid);
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
    if(args[0]==null){
      resume.run(client, message, args);
      return;
    }
    let playFileBool = false;
    if (args[0] == 'playFile') {
      playFileBool = true;
      args.shift();
    }
    let vol = args[1];
    if (args[2]){
      return message.channel.send(
        "Too many arguments"
      );
    }
    if (!!vol && isNaN(vol)) {
      return message.channel.send(
        "Volume argument must be numerical (between zero and 2) or omitted entirely"
      );
    } else{
      vol = Math.min(vol,2); // set max volume to 2
      vol = Math.max(vol,0); // set min volume to 0
    }
    if (!args[1]){
      vol = 1;
    }
    if (!serverQueue) {
      createServerQueue(queue,message,voiceChannel,vol,playFileBool);
      serverQueue = queue.get(gid);
    }else{
      serverQueue.playFileBool = playFileBool;
      serverQueue.voiceChannel = voiceChannel;
    }

    if (!serverQueue.connection) {
      try {
        let connection = await voiceChannel.join();
        serverQueue.connection = connection;
      } catch (err) {
        logger.error(err);
        queue.delete(gid);
        return message.channel.send(err);
      }
    }

    if (playFileBool){
      queue.get(gid).filevolume = vol;
      executePlayFile(client, message, args)
    } else {
      queue.get(gid).volume = vol;
      executePlayYT(voiceChannel,gid,message,queue,args[0]);
    }
}
exports.help = {
    name: "play",
    description: `Plays youtube audio in chat at volume specified by the volume multiplier. The volume it plays at is the yt vid's original volume times the volume multiplier`,
    args: `**<youtubeURL>** *<volume_multiplier(between 0-2)*>`
};