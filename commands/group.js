const {prefix,CHILD_DIR,GROUP_DIR} = require("../config.json");
const {extractArgs,verifyExistence,jsonAppend} = require("../modules/functions.js");

exports.run = async (client, message, args) => {
    let {iserr,childarr, grouparr} = extractArgs(message,client);
    if(iserr){
      return;
    }
  
    //validate child
    if (!verifyExistence(childarr,message,client)){
      return;
    }
    //append group to child jsons
    jsonAppend(message,childarr,grouparr,CHILD_DIR,client);
    //append child to group jsons
    jsonAppend(message,grouparr,childarr,GROUP_DIR,client);
}

exports.help = {
    name: "group",
    description: `Groups audio files into groups. Members of groups can be played at random with ${prefix}<group>`,
    args: `**<file1>** *... <fileN>*  **| <group1>** *... <groupM>*`
};