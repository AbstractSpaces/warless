# Warriors in a War-less World

###### (Title from a story I'll probably never write)

## The Project

This is my first real attempt at making a real game. It is a top-down, 1v1 real time strategy game that combines simple base building with fast paced arcade style combat.

The game will (eventually) have online multiplayer, and will be played through a web browser backed up by a Node server. The project is being written in Typescript, as I feel a complicated effort such as this will benefit greatly from compile time checks.  

## The Game

The game mechanics will grow and evolve as the project progresses and specifics for the current version can be found in game-rules.md, but I'll lay out a general overview here.

The map is a 2D plane viewed from a top-down perspective, with player bases at two ends. The goal is to destroy your opponent's base.

The players control a single Warrior each, using WASD to move and the mouse to aim and make melee attacks. Players can attack structures and each other, respawning at their base if they die.

Warriors are fast and powerful, but still need careful preparation in order to take down structures.

Combat mechanics will be simple, focussing on fast well timed slashes, blocks, and dodges. I'm embarrassed to make the cliche Dark Souls comparison, but that style of tense dueling is definitely a major inspiration.

There are a number of nodes around the map that players can build structures on, provided they have the necessary resources. Resources are collectibles that preiodically spawn around the map and must be collected by player's Warrior or other unit in order to be added to the stockpile.

Different structures serve different tactical functions, but their general purpose is to help the player gain control over the map and assist in making stronger attacks against the enemy base.  

The game flow involves players rushing around the map and having to make quick decisions about where their Warrior needs to be.

Do I need to back up my defences and engage the enemy Warrior personally? Can I send my drones to harass a structure and distract the enemy while I take over an empty node? Do I have enough map control to attempt a push on the enemy base?

The push-counterpush flow should resemble a MOBA, but with more emphasis on quickly moving around the map and more responsive arcade style combat.
