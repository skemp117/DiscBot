const { AUDIO_DIR, GROUP_DIR, DATA_DIR} = require("../config.json");
const { readdirSync, readFileSync,readdir } = require("fs");
const { join } = require('path');

exports.run = (client, message, args) => {
    const gid = message.guild.id;
    const {homedir, invalidnames} = client.container;
    const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
    
    let fnstring = 'Groups and their members:';
    const groupFiles = readdirSync(join(audiodir,GROUP_DIR)).filter(file => file.endsWith('.json'));
        for (const file of groupFiles) {
            if(invalidnames.indexOf(file.split('.')[0])==-1){
                fnstring += '\n\t!';
                fnstring += file.split('.')[0];
                fnstring += '\t\t'
                let childarr = JSON.parse(readFileSync(join(audiodir,GROUP_DIR,file)));
                childarr.forEach((child)=>{
                    fnstring += '\t'
                    fnstring += child;
                }
            );}
        }
    return message.channel.send(
        fnstring
    );
}

exports.help = {
  name: "listgroups",
  description: "Displays all the available groups to play",
  args: ``
};