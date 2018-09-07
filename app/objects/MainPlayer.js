class MainPlayer {

    constructor(id) {
        this.speed = 0.01;
        this.x = 2;
        this.y = 2;
        this.online = true;

        this.interval = 0;

        this.wsId = id;
        const ws = new WebSocket('ws://' + config.db.host + ':' + config.websocket.port);


        WebSockets[this.wsId] = ws;
        WebSockets[this.wsId].x = this.x;
        WebSockets[this.wsId].y = this.y;
        WebSockets[this.wsId].id = this.wsId;

    }

    Update() {
        this.x += this.speed;
        this.y += this.speed;

        this.Sync();

        // Up
        // if (38)
        //     this.y -= this.speed;
        // // Down
        // if (40)
        //     this.y += this.speed;
        // // Left
        // if (37)
        //     this.x -= this.speed;
        // Right


    }

    Sync() {
        const coordinates = { x: this.x, y: this.y };

        if (WebSockets[this.wsId]) {
            WebSockets[this.wsId].x = this.x;
            WebSockets[this.wsId].y = this.y;
            if (WebSockets[this.wsId].readyState === WebSocket.OPEN) {
                WebSockets[this.wsId].send(JSON.stringify(coordinates));

            }
        }
    }

}

module.exports = MainPlayer;