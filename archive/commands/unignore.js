const {writeFileSync,readFileSync} = require('fs')
const {join} = require("path")
const {DATA_DIR} = require("../config.json")

exports.run = async (client, message, args) => {
    if (args.length<1){
        return message.channel.send('Unignore requires at least 1 argument.')
    }

    const {homedir} = client.container;
    const gid = message.guild.id;

    if (!Array.isArray(args)){
        args = [args];
    }

    const ignore_path = join(homedir,DATA_DIR,gid,'guildIgnores.json');
    let rawdata = readFileSync(ignore_path);
    let data = JSON.parse(rawdata);
    let newignores = '';

    for (const arg of args){
        if (data.indexOf(arg)!==-1) {
            data = data.filter(function(value,index,array){
                return value != arg;
            })
            newignores+=' '+arg;
        }
    }
    if (!(newignores==='')){
        strjson = JSON.stringify(data,null,4);
        writeFileSync(ignore_path,strjson);
        message.channel.send('No longer ignoring commands:'+newignores)
    }else{
        message.channel.send('Those commands are are not ignored')
    }
}

exports.help = {
    name: "unignore",
    description: `Removes commands from this guild's ignore list`,
    args: `**<ignore1>** *... <ignoreN>* `
};