var fs=require('fs');
var file="./settings.json";
var result=JSON.parse(fs.readFileSync(file));
