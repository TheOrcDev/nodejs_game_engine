class GameLoop {

    construct(state, lasttime) {
        this.State = state;
        this.LastTime = lasttime;
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

        let currtime = new Date();

        let frametimedifference = currtime - this.LastTime;
        if (frametimedifference >= (1000 / 60)) {
            this.LastTime = currtime;
        }

        if (this.State != 'request_stop') {
    		setTimeout(update, 1);
        }
    }

    /**
     * Start the loop
     */
    Start() {    
        if (this.State == 'stopped')
            this.Updater();
    }

    /**
     * Stop the loop
     */
    Pause() {
        this.State = 'request_stop';
    }

}

module.exports = GameLoop;