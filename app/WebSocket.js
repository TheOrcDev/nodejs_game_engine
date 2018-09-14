WebSocket = require('ws');

/**
 * Creating WebSocket Server
 */
const wss = new WebSocket.Server({
    port: config.websocket.port,
    perMessageDeflate: {
        zlibDeflateOptions: { // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        clientMaxWindowBits: 10, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.

        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024, // Size (in bytes) below which messages
        // should not be compressed.
    }
});

function getAllPlayers() {
    let players = [];
    const sockets = Object.entries(WebSockets);

    sockets.forEach((socket) => {
        const Player = {
            user: socket[1].user,
            coordinates: socket[1].coordinates
        };
        if (socket) players.push(Player);
    });

    return JSON.stringify(players);
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/**
 * All WebSockets in one object, with all current users.
 */
WebSockets = [];

wss.on('connection', function(ws) {
    const sockets = Object.entries(WebSockets);
    let all = [];

    ws.on('message', function(message) {
        if (message == 'newplayer') {
            ws.send(getAllPlayers());
        }
        console.log(message);
    });

    // sockets.forEach((socket) => {
    //     ws.on('message', function(message) {
    //         console.log(message);
    //     });
    //     const obj = { x: socket[1].x, y: socket[1].y, id: socket[1].id }
    //     all.push(obj);
    // });

    // sockets.forEach((socket) => {
    //     try {
    //         ws.send(getAllPlayers(), function(error) {
    //             if (error == undefined) return;
    //             else return;
    //         });
    //     } catch (e) {
    //         ws.close();
    //     }
    // });

});

/**
 * Just a message of successful connection to WebSocket server
 */
console.log('Websockets connected.');