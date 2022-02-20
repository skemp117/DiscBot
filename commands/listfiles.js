const { AUDIO_DIR, AUDIO_EXT, CHILD_DIR, DATA_DIR} = require("../config.json");
const { readdirSync,readFileSync} = require("fs");
const { join } = require('path');

exports.run = (client, message, args) => {
    const gid = message.guild.id;
    const {homedir} = client.container;
    const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
    let fnstring = 'Playable audio files and the groups they are members of:';
    const audioFiles = readdirSync(audiodir).filter(file => file.endsWith(AUDIO_EXT));
    for (const file of audioFiles) {
        fnstring += '\n\t!';
        fnstring += file.split('.')[0];
        fnstring += '\t\t'
        const childFiles = readdirSync(join(audiodir,CHILD_DIR)).filter(file => file.endsWith(".json"))
        for (const child of childFiles) {
            let childarr = JSON.parse(readFileSync(join(audiodir,CHILD_DIR,child)));
            childarr.forEach((child)=>{
                fnstring += '\t';
                fnstring += child;
            });
        }
    }
    return message.channel.send(
        fnstring
    );
}

exports.help = {
  name: "listfiles",
  description: "Displays all the available files to play",
  args: ``
};