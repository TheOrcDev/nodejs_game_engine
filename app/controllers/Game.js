const GameLoop = require('./GameLoop.js');

class Game extends GameLoop {

    constructor(state, lasttime) {
        super(state, lasttime);
        this.state = state;
        this.lasttime = lasttime;
        this.Objects = [];
        this.Loop = GameLoop;
    }

    /**
     * Add object to loop
     */
    AddObject(obj) {
        this.Objects.push(obj);
    }

    /**
     * Remove object
     */
    RemoveObject(obj) {
        this.Objects.splice(this.Objects.indexOf(obj), 1);
    }

    /**
     * Update all objects
     */
    Update() {
        this.Objects.forEach((obj) => {
            obj.Update();
        });
    }

    /**
     * Start the loop
     */
    Start() {
        super.Start();
        this.Loop.Update = this.Update;
    };

    /**
     * Stop the loop
     */
    Stop() {
        super.Loop.Pause();
    };
}

module.exports = Game;