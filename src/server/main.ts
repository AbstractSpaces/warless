import * as express from "express"
import * as path from "path";

const port:number = 3000;
const app:express.Express = express();

app.use("/", route);

console.log("Listening on " + port);

app.listen(port);

// This will suffice while I focus on the game side of things.
function route(req:express.Request, res:express.Response): void {
    res.sendFile(path.resolve("public/index.html"));
}