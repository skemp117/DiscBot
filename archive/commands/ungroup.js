const {CHILD_DIR,GROUP_DIR} = require("../config.json");
const {extractArgs,verifyExistence,jsonRemove} = require("../modules/functions.js");

exports.run = async (client, message, args) => {
    let {iserr,childarr, grouparr} = extractArgs(message,client);
    if(iserr){
      return;
    }
  
    //validate child
    if (!verifyExistence(childarr,message,client)){
      return;
    }
    //remove group from child jsons
    jsonRemove(message,childarr,grouparr,CHILD_DIR,client);
    //remove child from group jsons
    jsonRemove(message,grouparr,childarr,GROUP_DIR,client);
}

exports.help = {
    name: "ungroup",
    description: `Removes audio files from groups`,
    args: `**<file1>** *... <fileN>*  **| <group1>** *... <groupM>*`
};