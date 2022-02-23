const { AUDIO_DIR, AUDIO_EXT, DATA_DIR} = require("../config.json");
const { createWriteStream, unlinkSync, existsSync } = require("fs");
const { convert_mp3_to_ogg } = require("../modules/functions.js")
const { join } = require('path');
const request = require(`request`);
const logger = require("../modules/Logger.js");

exports.run = (client, message, args) => {
    const gid = message.guild.id;
    const {homedir, invalidnames} = client.container;
    const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
    
    if(!message.attachments.first()){//checks if an attachment is sent
        return message.channel.send(
            "No attachment detected"
        );
    }
    if(!(message.attachments.first().name.split('.')[1] == 'mp3')){
        return message.channel.send(
            "Invalid filename. Wrong extension or extra period in filename."
        );
    }
    if(/\s/.test(message.attachments.first().name)){
        return message.channel.send(
            "Invalid filename. Whitespace not allowed"
        );
    }
    if (existsSync(join(audiodir,message.attachments.first().name.split('.')[0]+AUDIO_EXT))){
        return message.channel.send(
            "Filename already taken, please choose new filename"
        );
    }
    if (invalidnames.indexOf(message.attachments.first().name.split('.')[0])!== -1){
        return message.channel.send(
            "Invalid filename. Reserved for commands"
        );
    }
    message.channel.send("Downloading and converting file");
    let fn = join(audiodir,`${message.attachments.first().name}`);
    request.get(message.attachments.first().url)
        .on('error', (err)=>{logger.error(err)})
        .pipe(createWriteStream(fn))
        .on('finish',function(){
        convert_mp3_to_ogg(fn, (err)=>{
            unlinkSync(fn);
            if(!err) {
                return message.channel.send(
                    "Upload Successful!"
                );
            }else{
                logger.error(err)
                return message.channel.send(
                    "Upload unsuccessful, file may be corrupt!"
                );
            }
        });
    });

}

exports.help = {
  name: "upload",
  description: "Uploads .mp3 files to the server. Filename becomes call command",
  args: `(must be sent with an attachment)`
};