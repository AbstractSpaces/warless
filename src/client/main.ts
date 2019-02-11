import {TestLoad} from "./test_module";

const game = document.getElementById("GameWindow");

if(game === null) {
    console.log("Game window not found.");
}
else {
    game.innerHTML = TestLoad();
}