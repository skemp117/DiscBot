const {createServerQueue} = require("../modules/functions.js");
exports.run = async (client, message, args) => {
    const voiceChannel = message.member.voice.channel;
    const gid = message.guild.id;
    const {queue} = client.container;
    let serverQueue = queue.get(gid);

    if (!voiceChannel){
        return message.channel.send(
            "You need to be in a voice channel to summon the bot!"
        );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    if (!serverQueue) {
        vol = 1;
        playFileBool = false;
        createServerQueue(queue,message,voiceChannel,vol,playFileBool);
        serverQueue = queue.get(gid);
    }


    if (!!serverQueue.connection) {
        return message.channel.send(
            "Bot is already summoned!"
        );
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
}

exports.help = {
    name: "summon",
    description: `Summons the bot into the channel`,
    args: ``
};