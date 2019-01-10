# Warriors in a War-less World

###### (Title from a story I'll probably never write)

## The Project

This is my first real attempt at making a real game. It is a top-down, 1v1 real time strategy game that combines simple base building with fast paced arcade style combat.

The game will (eventually) have online multiplayer, and will be played through a web browser backed up by a Node server. The project is being written in Typescript, as I feel a complicated effort such as this will benefit greatly from compile time checks.

## Project Status

I've put a considerable amount of work into forming the data structures upon which the game logic will be built. I think I've done some good work, but in hindsight I should have first established a main loop that I could execute to test what I've written. I'm now working on said main loop and a server that can dish it out to the web browser. However the world of script loaders and bundlers (and getting them to play nice with TypeScript) is annoyingly complicated, so I'm still working out how best to actually get my code onto a client machine. Once that's done I'll write the main game loop, some basic graphics and start testing my precious data structures.

## The Game

The game mechanics will grow and evolve as the project progresses and specifics for the current version can be found in game-rules.md, but I'll lay out a general overview here.

The map is a 2D plane viewed from a top-down perspective, with player bases at two ends. The goal is to destroy your opponent's base.

The players control a single Warrior each, using WASD to move and the mouse to aim and make melee attacks. Players can attack structures and each other, respawning at their base if they die.

Warriors are fast and powerful, but still need careful preparation in order to take down structures.

Combat mechanics will be simple, focussing on fast well timed slashes, blocks, and dodges. I'm embarrassed to make the cliche Dark Souls comparison, but that style of tense dueling is definitely a major inspiration.

There are a number of nodes around the map that players can build structures on, provided they have the necessary resources. Resources are collectibles that periodically spawn around the map and must be collected by a player's Warrior or drone in order to be added to the stockpile. Resources are also consumed as structures regenerate their hit points after taking damage.

Different Structures serve different tactical functions, but their general purpose is to help the player gain control over the map and assist in making stronger attacks against the enemy base. The type of structure is determined by the type of node it is built on.

    * Turrets built on defence nodes will fire projectiles at enemies in range.
    * Resources spawn in a radius around resource nodes. Factories built on resource nodes will spawn a single drone at a time. Drones can be ordered to collect resources around their node, or to attack a selected target.
    * Powerup nodes periodically spawn collectibles that enhance a Warriors abilities. Minefields can be built around powerup nodes to deter the enemy Warrior from claiming the powerup.


The game flow involves players rushing around the map and having to make quick decisions about where their Warrior needs to be.

Do I need to back up my defences and engage the enemy Warrior personally? Can I send my drones to harass a structure and distract the enemy while I take over an empty node? Do I have enough map control to attempt a push on the enemy base?

The push-counterpush flow should resemble a MOBA, but with more emphasis on quickly moving around the map and more responsive arcade style combat.