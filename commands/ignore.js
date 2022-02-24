const {writeFileSync,readFileSync} = require('fs')
const {join} = require("path")
const {DATA_DIR} = require("../config.json")

exports.run = async (client, message, args) => {
    const {homedir,invalidnames} = client.container;
    const gid = message.guild.id;
    const ignore_path = join(homedir,DATA_DIR,gid,'guildIgnores.json');
    let rawdata = readFileSync(ignore_path);
    let data = JSON.parse(rawdata);

    let sendstr = 'List of ignored commands:';
    if (args.length<1){
        for (entry of data){
            sendstr+='\n\t'+entry
        }
        return message.channel.send(sendstr)
    }

    if (!Array.isArray(args)){
        args = [args];
    }

    let newignores = '';

    for (const arg of args){
        if (invalidnames.indexOf(arg)!==-1){
            message.channel.send(`Cannot ignore command: ${arg}`)
        }else if (data.indexOf(arg)===-1) {
            data.push(arg);
            newignores+=' '+arg;
        }
    }

    if (!(newignores==='')){
        strjson = JSON.stringify(data,null,4);
        writeFileSync(ignore_path,strjson);
        message.channel.send('Now ignoring commands:'+newignores)
    }else{
        message.channel.send('Those commands are already ignored')
    }
}

exports.help = {
    name: "ignore",
    description: `Ignores commands that may interfere with other bots. Returns list of ignored commands when provided without argument`,
    args: `*<ignore1> ... <ignoreN>* `
};