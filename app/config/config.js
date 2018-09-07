/**
 * Config
 */
const config = {
    app: {
        port: 8089
    },
    websocket: {
        port: 8088
    },
    db: {
        host: '127.0.0.1',
        port: 27017,
        name: 'db'
    },    
    game: {
        fps: 1000 / 60,
    }
};

module.exports = config;