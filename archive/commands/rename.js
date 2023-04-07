const {CHILD_DIR,GROUP_DIR,AUDIO_DIR,AUDIO_EXT,DATA_DIR} = require("../config.json");
const {jsonRemove,jsonAppend} = require("../modules/functions.js");
const {existsSync, rename, readFileSync} = require("fs");
const { join } = require('path');
const logger = require("../modules/Logger.js");

exports.run = async (client, message, args) => {
    const gid = message.guild.id;
    const {homedir, invalidnames} = client.container;
    const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
    const ignore_path = join(homedir,DATA_DIR,gid,'guildIgnores.json');
    const ignorethese = JSON.parse(readFileSync(ignore_path));

    let fn2rename = message.content.split(" ").slice(1);
    if (fn2rename.length>2){
      let sendstr = "There should only be 2 space seperated arguments";
          return message.channel.send(
            sendstr
          );
    }
    let oldname = fn2rename[0];
    let newname = fn2rename[1];
    if (invalidnames.indexOf(newname)!== -1){
        return message.channel.send(`Invalid name: ${newname}. reserved for commands`);
    }
    if (ignorethese.indexOf(newname)!== -1){
      return message.channel.send(`Invalid name: ${newname}. reserved for ignored commands in this guild`);
  }

    let filepath = join(audiodir,oldname+AUDIO_EXT)
    if (!existsSync(filepath)){
      filepath = join(audiodir,GROUP_DIR,oldname+'.json');
      if (!existsSync(filepath)){
        return message.channel.send(
            `There is no group or file named: ${oldname}. Type !list for a list of groups and audio files`
        );
      }else{
        let newfilepath = join(audiodir,GROUP_DIR,newname+'.json');
        let rawdata = readFileSync(filepath);
        let childarr = JSON.parse(rawdata);
        jsonAppend(message,childarr,newname,CHILD_DIR,client); // append new name to all members in group
        jsonRemove(message,childarr,oldname,CHILD_DIR,client); // remove old name from all members in group
        rename(filepath, newfilepath, function(err) { //rename json file
          if ( err ) logger.error(err);
        });
      }
    }else{
      let newfilepath = join(audiodir,newname+AUDIO_EXT);
      if (existsSync(join(audiodir,CHILD_DIR,oldname+'.json'))){
        let rawdata = readFileSync(join(audiodir,CHILD_DIR,oldname+'.json'));
        let parentarr = JSON.parse(rawdata);
        jsonAppend(message,parentarr,newname,GROUP_DIR,client); // append new name to all groups this is a member of
        jsonRemove(message,parentarr,oldname,GROUP_DIR,client); // remove old name from all groups this is a member of
        rename(join(audiodir,CHILD_DIR,oldname+'.json'), join(audiodir,CHILD_DIR,newname+'.json'), function(err) { //rename json file
          if ( err ) logger.error(err);
        });
      }
      rename(filepath, newfilepath, function(err) { //rename json file
        if ( err ) logger.error(err);
      });
    }
}

exports.help = {
    name: "rename",
    description: `Renames audio files or groups`,
    args: `**<old_file_or_group_name> <new_file_or_group_name>**`
};