// This config file is only used to bundle client game code. Server side code is untouched.
const path = require('path');

module.exports = {
    entry: "./dist/game/client/Main.js",
    output: {
        filename: "ClientGame.js",
        path: path.join(__dirname, "public/script")
    },
    mode: "development"
};