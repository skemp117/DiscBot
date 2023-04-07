const { AUDIO_DIR, AUDIO_EXT, CHILD_DIR, DATA_DIR} = require("../config.json");
const { readdirSync,readFileSync,existsSync} = require("fs");
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
        if (existsSync(join(audiodir,CHILD_DIR,file.split('.')[0]+'.json'))){
            let childarr = JSON.parse(readFileSync(join(audiodir,CHILD_DIR,file.split('.')[0]+'.json')));
            childarr.forEach((child)=>{
                fnstring += '\t';
                fnstring += child;
            });
        }
    }
    return message.channel.send(
        fnstring,{ split: true }
    );
}

exports.help = {
  name: "listfiles",
  description: "Displays all the available files to play",
  args: ``
};