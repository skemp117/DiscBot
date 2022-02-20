const {YT_VOL_MULT} = require("../config.json");
const {createServerQueue} = require("../modules/functions.js");

exports.run = (client, message, args) => {
    const gid = message.guild.id;
    const {queue} = client.container;
    serverQueue = queue.get(gid);

    let vol = args[0];
    if (!vol || isNaN(vol)) {
      return message.channel.send(
        "Volume argument must be numerical (between zero and 2)"
      );
    } else{
      vol = Math.min(vol,2); // set max volume to 2
      vol = Math.max(vol,0); // set min volume to 0
    }

    if (!serverQueue) {
        createServerQueue(queue,message,null,vol,false);
    }else{
        serverQueue.volume = vol; //dont divide by YT_VOL_MULT here, it is done at the playYT function 
        serverQueue.filevolume = vol;
        if (!!serverQueue.connection.dispatcher){
          if (!serverQueue.playFileBool){
              serverQueue.connection.dispatcher.setVolume(vol/YT_VOL_MULT); // if you reduce this, YT plays super loud
          } else {
              serverQueue.connection.dispatcher.setVolume(vol);
          }
        }
    }
    return message.channel.send(
        `Volume set to ${vol}`
    );
}

exports.help = {
  name: "volume",
  description: "Changes the volume of current playback. Does not affect future command volume",
  args: `**<new_volume_multiplier>**`
};