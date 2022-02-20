
exports.run = async (client, message, args) => {
    const gid = message.guild.id;
    const {queue} = client.container;
    const serverQueue = queue.get(gid);

    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to pause the music!"
      );
    if (serverQueue.songs.length < 1 || !serverQueue.songs){
        return message.channel.send("There is no song playing!");
    }
    if (serverQueue.pausebool) {
        return message.channel.send("Already paused!");
    }
    message.channel.send(`Pausing: **${serverQueue.songs[0].title}**`);
    serverQueue.connection.dispatcher.pause(true);
    serverQueue.pausebool = true;
    serverQueue.seektime = serverQueue.connection.dispatcher.pausedSince-serverQueue.starttime;
    return;
}

exports.help = {
    name: "pause",
    description: `Pauses playback of youtube audio only.`,
    args: ``
};