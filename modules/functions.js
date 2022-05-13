const getYoutubeTitle = require('get-youtube-title');
const getYouTubeID = require('get-youtube-id');
const ytdl = require("ytdl-core");
const {VOL_MULT,YT_VOL_MULT,AUDIO_EXT, GROUP_DIR, AUDIO_DIR, DATA_DIR, YT_KEY} = require("../config.json");
const {existsSync, readFileSync, writeFileSync, unlinkSync, createReadStream} = require("fs");
const { join } = require('path');
const ffmpeg = require('fluent-ffmpeg');
const logger = require("./Logger.js");

function myGetYoutubeTitle(id) {
    key = YT_KEY;
    if (key === "<your-api-key>"){
      key = null;
    }
    return new Promise((resolve) => {
      getYoutubeTitle(id, key, (err,title)=>{
        if (!err){
          resolve(title);
        }else{
          logger.error(err);
          resolve('Title Not Found');
        }
      })
    })
  }

async function playYT(guild, queue, seektime) {
    let codecType = null;
    if (seektime==null) {
      seektime = 0; 
      codecType = 'webm/opus'; // I would like to use the webm/opus codec all the time, but it doesn't support seek
    }
    const gid = guild.id;
    const serverQueue = queue.get(gid);
    let song = serverQueue.songs[0];
    if (!song) {
      queue.delete(gid);
      return;
    }
      readStream =  ytdl(song.url,({download:false, filter: 'audioonly', highWaterMark: 3, quality: 249}));
      serverQueue.connection
        .play(readStream,{seek: seektime/1000, type: codecType}) //249 was lowestaudio
        .on("finish", () => {
              setTimeout(function() {
                serverQueue.songs.shift();
                playYT(guild, queue, null);
              }, 500);
        })
        .on("error", err => logger.error(err))
        .setVolume(serverQueue.volume/YT_VOL_MULT); // if you don't do this, YT plays super loud
    if (seektime != 0){
      serverQueue.textChannel.send(`Resuming: **${song.title}**`);
    }else{
      serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
    serverQueue.starttime = Date.now();
    serverQueue.playFileBool = false;
    return;
  }

  async function executePlayYT(voiceChannel,gid,message,queue,url){
    const serverQueue = queue.get(gid);
    let song = [];
    let id = getYouTubeID(url,{fussy:false});
    if (!id){
      return  message.channel.send('There is something wrong with your URL');
    }
    let title = await myGetYoutubeTitle(id);

    song = {
      title,
      url
    }
    if (serverQueue.songs.length < 1 || !serverQueue.songs){
        serverQueue.songs.push(song);
        playYT(message.guild, queue, null);
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }

async function executePlayFile(client, message, args) {
    const gid = message.guild.id;
    const {homedir} = client.container;
    const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
    const {queue} = client.container;
    const serverQueue = queue.get(message.guild.id);
  
    let fn = args[0];
  
    if (!existsSync(join(audiodir,fn+AUDIO_EXT))){
      if (!existsSync(join(audiodir,GROUP_DIR,fn+'.json'))){
        return message.channel.send(
          "You need to enter a valid command!"
        );
      }else{
        // This means it is a group, pick random file from group and play it
        let rawdata = readFileSync(join(audiodir,GROUP_DIR,fn+'.json'));
        let arr = JSON.parse(rawdata);
        fn = arr[Math.floor(Math.random()*arr.length)];
      }
    }
    const voiceChannel = message.member.voice.channel;
    let { starttime, pausebool, songs } = serverQueue;
    if (!pausebool && songs.length>0){ //if there is a song playing condition being we aren't paused and 
      serverQueue.connection.dispatcher.pause(true);
      serverQueue.seektime = serverQueue.connection.dispatcher.pausedSince-starttime;
      let readStream = createReadStream(join(audiodir,fn+AUDIO_EXT));
      serverQueue.connection
          .play(readStream)
          .on("finish", () => {
            if ((serverQueue.songs.length>0) && (!pausebool)){
              setTimeout(function() {
                playYT(message.guild, queue, serverQueue.seektime);
              }, 500);
            }
          })
          .on("error", err => logger.error(err))
          .setVolume(serverQueue.filevolume/VOL_MULT);
    }
    else { //if there isnt a song playing
      let readStream = createReadStream(join(audiodir,fn+AUDIO_EXT));
      serverQueue.connection
        .play(readStream)
        .on("error", err => logger.error(err))
        .setVolume(serverQueue.filevolume/VOL_MULT)
    }
    serverQueue.playFileBool = true;
    return 
  }

  function extractArgs(message, client){
    const gid = message.guild.id;
    const {homedir} = client.container;
    //Process commands, extract arguments
    let iserr = true;
    let args1 = message.content.split("!")[1];
    if (args1.indexOf("|")==-1){
      message.channel.send(
        "Use a \"|\" to seperate file and group argumensts. !group <files> | <groups>"
      );
      return {iserr,undefined,undefined};
    }
    let args2 = args1.split("|");
    let childarr = args2[0];
    let grouparr = args2[1];
    childarr = childarr.split(" ").slice(1);
    if (!childarr || !grouparr){
      message.channel.send(
        "Please enter file and destination in the form:\n !group <fn_no_ext1> ... <fn_no_extN> | <group1> ... <groupM>"
      );
      return {iserr,childarr,grouparr};
    }
    grouparr = grouparr.split(" ");
    childarr = childarr.filter(function(entry) { return /\S/.test(entry); });
    grouparr = grouparr.filter(function(entry) { return /\S/.test(entry); });
    iserr = false;
    return {iserr,childarr,grouparr}
}

function verifyExistence(itemarr,message,client){
  const gid = message.guild.id;
  const {homedir} = client.container;
  const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
  if (!Array.isArray(itemarr)){
    itemarr = [itemarr];
  }
  let exists = true;
  itemarr.forEach((item) => {
    // Check audio directory for mp3
    let fullpath = join(audiodir,item+AUDIO_EXT);
    exists = existsSync(fullpath);
    if (!exists){
      let sendstr = item + " audio file does not exist.";
      message.channel.send(sendstr);
      return exists;
    }
  });
  return exists;
}

function jsonAppend(message,parentarr,childarr,parentfolder,client){
  //Appends all elements in child to every json file in parent
  const gid = message.guild.id;
  const {homedir} = client.container;
  const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);
  const ignore_path = join(homedir,DATA_DIR,gid,'guildIgnores.json');
  const ignorethese = JSON.parse(readFileSync(ignore_path))
  const {invalidnames} = client.container;
  restrictednames = Object.values({...invalidnames, ...ignorethese});
  
  if (!Array.isArray(parentarr)){
    parentarr = [parentarr];
  }
  if (!Array.isArray(childarr)){
    childarr = [childarr];
  }
  parentarr.every((parent) => {
    let parentpath = join(audiodir,parentfolder,parent+'.json');
    if (!existsSync(parentpath)){
      if (parentfolder==GROUP_DIR){
        if (existsSync(join(audiodir,parent+AUDIO_EXT))){
          let sendstr = "Group cannot have same name as file: "+parent+", please choose new filename"
          message.channel.send(sendstr);
          return true;
        }else if (restrictednames.indexOf(parent)!== -1){
          let sendstr = "Invalid group name: "+parent+". reserved for commands"
          message.channel.send(sendstr);
          return true;
        }
      }
      writeFileSync(parentpath,JSON.stringify([]));
      if (parentfolder === GROUP_DIR){
        let sendstr = "New group created: "+parent;
        message.channel.send(sendstr);
      }
    }
    let rawdata = readFileSync(parentpath);
    let str = JSON.parse(rawdata);
    childarr.every((child) => {
      if (restrictednames.indexOf(child)!== -1){
        return true;
      }else{
        if (str.indexOf(child)==-1){
          str.push(child);
        }
      }
      return true;
    });
    strjson = JSON.stringify(str);
    writeFileSync(parentpath,strjson);
    return true;
  });
}

function jsonRemove(message,parentarr,childarr,parentfolder,client){
  //Removes all elements in child from every json file in parent
  const gid = message.guild.id;
  const {homedir} = client.container;
  const audiodir = join(homedir,DATA_DIR,gid,AUDIO_DIR);

  if (!Array.isArray(parentarr)){
    parentarr = [parentarr];
  }
  if (!Array.isArray(childarr)){
    childarr = [childarr];
  }
  parentarr.every((parent) => {
    let parentdeleted = false;
    let parentpath = join(audiodir,parentfolder,parent+'.json');
    if (!existsSync(parentpath)){
      if (parentfolder == GROUP_DIR) {
        let sendstr = "Group does not exist: "+parent;
        message.channel.send(sendstr);
      }
      return false;
    }
    let rawdata = readFileSync(parentpath);
    let str = JSON.parse(rawdata);
    childarr.every((child) => {
      let index = str.indexOf(child);
      if (index==-1){
        if (parentfolder == GROUP_DIR){
          let sendstr = child + " is not a member of " + parent;
          message.channel.send(sendstr);
        }
      }else{
        str.splice(index, 1);
        if (str.length == 0) {
          unlinkSync(parentpath);
          parentdeleted = true;
          return false;
        }
      }
      return true;
    });
    if (!parentdeleted){
      strjson = JSON.stringify(str);
      writeFileSync(parentpath,strjson);
    }
    return true;
  });
}

function convert_mp3_to_ogg(input, callback) {
  ffmpeg()
    .input(input)
    .audioBitrate('64k') //was 96
    .audioCodec('libopus')
    .output(input.replace('.mp3','.ogg'))
    .on('end', function() {
        callback(null);
    }).on('error', function(err){
        logger.error(err);
        callback(err);
    }).run();
}

function createServerQueue(queue,message,voiceChannel,vol,playFileBool) {
  const gid = message.guild.id;
  const serverQueue = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: vol, 
    filevolume: vol,
    playing: true,
    starttime: null,
    pausebool: false,
    seektime: null,
    playFileBool
  };
  queue.set(gid, serverQueue);
}

  module.exports = {myGetYoutubeTitle,playYT,executePlayYT,executePlayFile,getYouTubeID,extractArgs,verifyExistence,jsonAppend,jsonRemove,convert_mp3_to_ogg,createServerQueue}