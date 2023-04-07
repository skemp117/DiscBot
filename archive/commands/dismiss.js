
exports.run = async (client, message, args) => {
    if (!message.member.voice.channel){
        return message.channel.send(
            "You have to be in a voice channel to dismiss the bot!"
        );
    }
    const {queue} =  client.container
    const serverQueue = queue.get(message.guild.id)
    if (serverQueue){
        serverQueue.songs = [];
        serverQueue.voiceChannel.leave();
        return queue.delete(serverQueue.voiceChannel.guild.id);
    }
    if (!!message.guild.me.voice.channel) {
        return message.guild.me.voice.channel.leave();
    }
}

exports.help = {
    name: "dismiss",
    description: `Stops playback of all audio and leaves the voice channel`,
    args: ``
};