class MainPlayer {

    constructor() {
        // this.Image = new Image();
        // this.Image.src = '';

        this.speed = 2.5;
        this.x = 2;
        this.y = 2;

        this.interval = 0;
    }

    Update() {
        // Up
        if (38)
            this.y -= this.speed;
        // Down
        if (40)
            this.y += this.speed;
        // Left
        if (37)
            this.x -= this.speed;
        // Right
        if (39)
            this.x += this.speed;

    }

}

module.exports = MainPlayer;