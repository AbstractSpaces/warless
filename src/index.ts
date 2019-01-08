import express = require("express");
import path = require("path");

const app:express.Express = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);