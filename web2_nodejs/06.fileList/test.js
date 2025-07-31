let folder = "./data";
let fs = require("fs");

// readdir, 비동기
fs.readdir(folder, (error, list) => console.log(list));

// readdirSync, 동기
let dir = fs.readdirSync(folder);
console.log(dir);
