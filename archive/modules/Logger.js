/*
Logger class for easy and aesthetically pleasing console logging 
*/
const { cyan, red, magenta, gray, yellow, white, green } = require("colorette");
const {existsSync, writeFile, appendFileSync} = require('fs');
const {LOG_FILE} = require('../config.json')

exports.log = (content, type) => {
  const timestamp = `[${cyan(new Date().toLocaleString())}]:`;
  if (!existsSync(LOG_FILE)){writeFile(LOG_FILE,'',(err)=>{
    if (err) console.error(err);
  })}
  appendFileSync(LOG_FILE, `\n${new Date().toLocaleString()}\t${content}`, (err) => {
    if (err) console.error(err);
  });
  switch (type) {
    case "log": return console.log(`${timestamp} ${gray(type.toUpperCase())} ${content} `);
    case "warn": return console.log(`${timestamp} ${yellow(type.toUpperCase())} ${content} `);
    case "error": return console.log(`${timestamp} ${red(type.toUpperCase())} ${content} `);
    case "debug": return console.log(`${timestamp} ${magenta(type.toUpperCase())} ${content} `);
    case "cmd": return console.log(`${timestamp} ${white(type.toUpperCase())} ${content}`);
    case "ready": return console.log(`${timestamp} ${green(type.toUpperCase())} ${content}`);
    default: console.log(content);
  }
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");