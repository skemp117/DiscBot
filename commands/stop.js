
exports.run = async (client, message, args) => {
    if (!message.member.voice.channel){
        return message.channel.send(
            "You have to be in a voice channel to stop playback!"
        );
    }
    const {queue} =  client.container
    const serverQueue = queue.get(message.guild.id)
    serverQueue.starttime = null;
    serverQueue.pausebool = true;
    serverQueue.songs.shift();
    serverQueue.connection.dispatcher.destroy();
}

exports.help = {
    name: "stop",
    description: `Stops playback of all audio`,
    args: ``
};