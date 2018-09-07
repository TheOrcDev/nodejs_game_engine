WebSocket = require('ws');

/**
 * Creating WebSocket Server
 */
wss = new WebSocket.Server({
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


/**
 * All WebSockets in one object, with all current users.
 */
WebSockets = [];

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
    });

    setInterval(function() {
        const sockets = Object.entries(WebSockets);

        let all = [];

        sockets.forEach((socket) => {
            const obj = { x: socket[1].x, y: socket[1].y }
            all.push(obj);
        });

        sockets.forEach((socket) => {
            try {
                ws.send(JSON.stringify(all), function(error) {
                    if (error == undefined) return;
                    else return;
                });
            } catch (e) {
                ws.close();
            }
        });

    }, config.game.fps);
});

/**
 * Just a message of successful connection to WebSocket server
 */
console.log('Websockets connected.');