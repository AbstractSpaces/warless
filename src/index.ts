import express = require("express");
import path = require("path");
import { TestLoad } from "./game/server/Main";

const port:number = 3000;
const app:express.Express = express();

app.use("/", route);

console.log(TestLoad());
console.log("Listening on " + port);

app.listen(port);

// This will suffice while I focus on the game side of things.
function route(req:express.Request, res:express.Response): void {
    res.sendFile(path.join(__dirname + "/../public/index.html"));
}