class MainPlayer {

    constructor(id) {
        // speed
        this.speed = 2;

        // position
        this.x = 100;
        this.y = 100;

        // player id
        this.wsId = id;

    }

    Update() {
        this.Controls();
        this.Sync();
    }

    Sync() {
        const coordinates = { x: this.x, y: this.y, id: this.wsId };

            
        if (WebSockets[this.wsId]) {
            WebSockets[this.wsId].x = this.x;
            WebSockets[this.wsId].id = this.wsId;
            WebSockets[this.wsId].y = this.y;
            if (WebSockets[this.wsId].readyState === WebSocket.OPEN) {
                WebSockets[this.wsId].send(JSON.stringify(coordinates));

            }
        }
    }

    Controls() {
        // Left
        if (this.left)
            this.x -= this.speed;
        // Right
        if (this.right)
            this.x += this.speed;
        // Down
        if (this.down)
            this.y -= this.speed;
        // Up        
        if (this.up)
            this.y -= this.speed;
    }

}

module.exports = MainPlayer;