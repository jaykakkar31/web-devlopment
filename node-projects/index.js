// console.log("HEllo world");

// const fs=require("fs");
// // import fs from "fs";
// fs.copyFileSync("text.txt","text1.txt");


const superheroes = require("superheroes");


//=> ['3-D Man', 'A-Bomb', …]
console.log(superheroes.random());


const supervillains = require("supervillains");

// supervillains.all;
//=> ['Abattoir', 'Able Crown', …]
console.log(supervillains.random());
