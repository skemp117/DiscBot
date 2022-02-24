const {CHILD_DIR,GROUP_DIR,AUDIO_DIR,AUDIO_EXT,DATA_DIR} = require("../config.json");
const {jsonRemove} = require("../modules/functions.js");
const {existsSync, readFileSync, unlinkSync} = require("fs");
const { join } = require('path');

exports.run = async (client, message, args) => {
    const gid = message.guild.id;
    const {homedir} = client.container;
    const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);

    let fn2deletearr = message.content.split(" ").slice(1);
    fn2deletearr.forEach((fn2delete) => {
        let filepath = join(audiodir,fn2delete+AUDIO_EXT)
        if (!existsSync(filepath)){
            filepath = join(audiodir,GROUP_DIR,fn2delete+'.json');
            if (!existsSync(filepath)){
                return message.channel.send(`There is no group or file named: ${fn2delete}. Type !list for a list of groups and audio files`);
            }else{
                let parent = fn2delete;
                let rawdata = readFileSync(filepath);
                let childarr = JSON.parse(rawdata);
                jsonRemove(message,childarr,parent,CHILD_DIR,client);
                jsonRemove(message,parent,childarr,GROUP_DIR,client);
            }
        }else{
            if (existsSync(join(audiodir,CHILD_DIR,fn2delete+'.json'))){
                let child = fn2delete;
                let rawdata = readFileSync(join(audiodir,CHILD_DIR,fn2delete+'.json'));
                let parentarr = JSON.parse(rawdata);
                jsonRemove(message,parentarr,child,GROUP_DIR,client); //remove audio file from all associated jsons
                unlinkSync(join(audiodir,CHILD_DIR,fn2delete+'.json')); //delete json associated with audio file
            }
            unlinkSync(filepath);
        }
    });
}

exports.help = {
    name: "delete",
    description: `Delete audio files or groups`,
    args: `**<group_or_file1>** *... <group_or_fileN>*`
};