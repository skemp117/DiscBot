const {playYT} = require("../modules/functions.js");

exports.run = async (client, message, args) => {
    const gid = message.guild.id;
    const {queue} = client.container;
    const serverQueue = queue.get(gid);

    if (!message.member.voice.channel){
        return message.channel.send("You have to be in a voice channel to resume the music!");
        }
    if (serverQueue.songs.length < 1 || !serverQueue.songs || !serverQueue.pausebool){
        return message.channel.send("There is nothing to resume!");
    }

    serverQueue.pausebool = false;
    playYT(message.guild, queue, serverQueue.seektime);

    return;
}

exports.help = {
    name: "resume",
    description: `Resumes playback of youtube audio only.`,
    args: ``
};