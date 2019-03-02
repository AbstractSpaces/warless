import * as express from "express";
import { router } from "./routes/index";

const port = 3000;
const app = express();

app.use(router);

console.log("Listening on " + port);
app.listen(port);