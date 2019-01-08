import express = require("express");
import path = require("path");
import { TestLoad } from "./game_server/ServerMain";

const app:express.Express = express();
const pubDir:string = path.join(__dirname, '/public');
const port:number = 3000;

app.use(express.static(pubDir));

console.log(TestLoad());
console.log("Listening on " + port + " serving files from " + pubDir);

app.listen(port);