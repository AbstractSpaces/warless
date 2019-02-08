"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestModule_1 = require("./TestModule");
var game = document.getElementById("GameWindow");
if (game === null) {
    console.log("Game window not found.");
}
else {
    game.innerHTML = TestModule_1.TestLoad();
}
