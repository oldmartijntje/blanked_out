## changes
- [ ] Developing in development branch. (also add it to the CLI)
- [ ] FPS counter (setting)
- [ ] ~~convert to typescript~~ - maybe another branch.
- [ ] Give all methods /** */ comments
- [ ] Turn the main branch into the gameEngine, and the game branch into the DEMO.
- [ ] a file with all Event `const` variables
- [ ] use states for things like picking up, instead of seperate checks etc for every single option
- [ ] rename HERO to PLAYER
- [x] make player an Entity class
    - [x] give the entity class a speed field, which applies on movement
    - [ ] move the player controls into a attrebute that is applyable to all "Entity" types.
- [ ] places with 'nextId', either use UUID or make it loadable for savestates (cause now it always starts at 0)
- [ ] on things like inventory, OnInit won't be called. (maybe an ignore camera offset boolean which removes the offset on rendering by adding a negative offset of the camera to the sprite.)
- [x] add math.round to colision checks ( this.destinationPosition or inside the function)
- [ ] ~~rework the position system so that it only multiplies the location by 16 whenever drawing.~~
- [ ] make everything a const
- [ ] onclick pathfinding (mostly for mobile players)
- [ ] merge SpriteTextString() and TextBox()
- [ ] not all textboxes should lock the player.
- [ ] HERO_REQUESTS_ACTION withObject.getContent(); should return a type, and when the type = text, show textbox.
- [ ] make text interactions an attribute
- [ ] on init of level, give every tile a number, and every entity defines what numbers it sees as a wall.
- [ ] when an entity moves to a position, it should reserve the position it is on, and moving towards, to avoid frameclips
    - [ ] a global map object would be good for this.

## additions
- [ ] render distance.
- [ ] add attrebutes (like rigidbody is a thing in unity you can apply to everything.)
- [ ] add a global variables list for easy saving, loading, and interconnected behaviour.
- [ ] stringed chats, multiple forced messages after eachother.
- [ ] saving
- [ ] multiplayer support
- [ ] being able to set events to be emitted after you are done talking with a specific message.
- [ ] a function to store a string of booleans into an int. (and to retrieve it.)

## extra's
    - [ ] add to website links (personal)
    - [ ] add a credits section (customisable.)
    - [ ] add a piece of code to api, which blocks the game from running in production.
    - [ ] add a locastorage token to fix the above.