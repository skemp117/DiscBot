const { playYT } = require("../modules/functions.js");

exports.run = async (client, message, args) => {
    if (!message.member.voice.channel)
        return message.channel.send(
        "You have to be in a voice channel to skip the music!"
        );
    const {queue} =  client.container
    const serverQueue = queue.get(message.guild.id)
    if (serverQueue){
        if (serverQueue.playFileBool){
            playYT(message.guild, queue, serverQueue.seektime);
        }else{
            serverQueue.songs.shift();
            playYT(message.guild, queue, null);
        }
        return
    }
    if (!!message.guild.me.voice.channel) {
        return message.guild.me.voice.channel.leave();
    }
}
exports.help = {
    name: "skip",
    description: `Skips what is currently playing`,
    args: ``
};