class GameLoop {

    construct(state, lasttime) {
        this.state = state;
        this.lastTime = lastTime;
    }

    /**
     * Update if needed
     */
    Update() {

    }

    /**
     * Main method, all magic is in here - looping through game
     */
    Updater() {
        this.Update();
        const update = () => this.Updater();

        let currentTime = new Date();

        let frameTimeDifference = currentTime - this.lastTime;
        if (frameTimeDifference >= (config.game.fps)) {
            this.lastTime = currentTime;
        }

        if (this.state != 'request_stop') {
            setTimeout(update, 1);
        }
    }

    /**
     * Start the loop
     */
    Start() {
        if (this.state == 'stopped')
            this.Updater();
    }

    /**
     * Stop the loop
     */
    Pause() {
        this.state = 'request_stop';
    }

}

module.exports = GameLoop;