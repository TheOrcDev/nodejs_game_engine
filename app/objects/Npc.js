class Npc {

    constructor() {
        this.speed = 0.1;
        this.x = 20;
        this.y = 100;

        this.interval = 0;

        this.wsId = Math.random();

        const ws = new WebSocket('ws://' + config.db.host + ':' + config.websocket.port);

        WebSockets[this.wsId] = ws;
        WebSockets[this.wsId].x = this.x;
        WebSockets[this.wsId].y = this.y;

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
console.log(coordinates);
        WebSockets[this.wsId].x = this.x;
        WebSockets[this.wsId].y = this.y;
        if (WebSockets[this.wsId].readyState === WebSocket.OPEN) {
            WebSockets[this.wsId].send(JSON.stringify(coordinates));

        }
    }

}

module.exports = Npc;