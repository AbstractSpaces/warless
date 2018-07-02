# Warriors in a War-less World
###### (Title from a story I'll probably never write)
## The Project
This is my first real attempt at making a real game.  
It is a top-down, 1v1 real time strategy game that combines simple base building with fast paced arcade style combat.  
The game with have online multiplayer, and will be implemented in the web browser for maximum portability and easier development.  

Having just got my feet wet with MEAN, I'll be using a Node.js server so I can write everything in TypeScript.  
Writing client and server with the same language should make things easier, while TypeScript will hopefully reduce the occurrence of rage inducing errors compared to standard JavaScript.  
Plus it's an excuse to finally get familiar with Visual Studio.

Why am I coding everything from scratch rather than using an established framework? This project is intended as both a learning exercise and a demonstration of my abilities. I realise homebrewing is usually a bad idea, but I hope to gain an appreciation of what makes those frameworks tick under the hood.

Though I haven't made a game since Game Maker in high school, I've done plenty of complex simulation projects for university and don't expect to encounter too many surprises in creating a playable experience (that's not to say I expect it to be simple). Making the controls feel responsive and the animations fluid will probably be the biggest hurdles on that front.  
I expect the main challenge to be implementing an elegant client-server model with a pleasant interface and robust latency management.

Initial efforts will be focused on working out appropriate data models and algorithms, but eventually I hope to have a fully operational website with persistent user accounts and maybe even some form of matchmaking.

## The Game
The game mechanics will grow and evolve as the project progresses and specifics for each version can be found in Design, but I'll lay out a general overview here.

The map is a 2D plane viewed from a top-down perspective, with player bases at two ends. The goal is to destroy your opponent's base.  
The players control a single Warrior each, using WASD to move and the mouse to aim and make melee attacks. Players can attack structures and each other, respawning at their base if they die.  
Warriors are fast and powerful, but still need careful preparation in order to take down structures.
Combat mechanics will be simple, focussing on fast well timed slashes, blocks, and dodges. I'm embarrassed to make the cliche Dark Souls comparison, but that style of tense dueling is definitely a major inspiration.

There are a number of nodes around the map that players can build structures on, provided they have the necessary resources.  
Different structures serve different tactical functions, but their general purpose is to help the player gain control over the map and assist in making stronger attacks against the enemy base.  

The game flow involves players rushing around the map and having to make quick decisions about where their warrior needs to be.  
Do I need to back up my defences and engage the enemy Warrior personally? Can I send my drones to harass a structure and distract the enemy while I take over an empty node? Do I have enough map control to attempt a push on the enemy base?  
The push-counterpush flow should resemble a MOBA, but with more emphasis on quickly moving around the map and more responsive arcade style combat.
