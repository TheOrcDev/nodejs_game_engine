class UserController {

    constructor() {

        // Schema from model
        this.UserTable = User.userModel;
    }

    /**
     * Test API
     * @return json
     */
    test(req, res) {
        const Game = require('./Game.js');
        const Player = require('../objects/MainPlayer.js');
        const Npc = require('../objects/Npc.js');
        const go = new Game('stopped', new Date());
        const play = new Player();
        go.AddObject(play);
        
        go.Start();

        // let Canvas = require('canvas'),
        //     Image = Canvas.Image,
        //     canvas = new Canvas(200, 200),
        //     ctx = canvas.getContext('2d');

        // ctx.font = '30px Impact';
        // ctx.rotate(.1);
        // ctx.fillText("aaaaaa!", 50, 100);

        // let te = ctx.measureText('aaaaaa!');
        // ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        // ctx.beginPath();
        // ctx.lineTo(50, 102);
        // ctx.lineTo(50 + te.width, 102);
        // ctx.stroke();

        // res.setHeader('Content-Type', 'image/png');
        // canvas.pngStream().pipe(res);

        res.sendFile('index.html', { 'root': './' });

    }

    /**
     * Get all users
     * @return json
     */
    getAll(req, res) {
        this.UserTable.find({}).then(eachOne => {
            res.json(eachOne);
        });
    }

    /**
     * Create a new user
     * @return json
     */
    create(req, res) {
        this.UserTable.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConf: req.body.passwordConf
        }).then(user => {
            res.json(user);
        });
    }

    /**
     * Get all currently logged in users
     * @return json
     */
    getAllLoggedUsers(req, res) {

        const users = Object.entries(WebSockets);
        const currentUsers = [];
        users.map((value, key, a) =>
            currentUsers.push(value[1].user)
        );

        res.json(currentUsers);

    }

    /**
     * Login user
     * @return json
     */
    loginUser(req, res) {
        const self = this;

        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function(error, user) {
                if (error || !user) {
                    // Wrong credentials
                    self.error('Wrong email or password.', 401);
                } else {
                    // Successful login
                    req.session.userId = user._id;
                    res.json('logged with user id: ' + req.session.userId);

                    // Open WebSocket for logged user
                    self.openWebSocket(user, req);
                }
            });

        } else {
            self.error('All fields required.', 400);
        }
    }

    /**
     * Logout user
     * @return json
     */
    logoutUser(req, res) {

        if (req.session) {
            // destroy websocket for this specific user
            try {
                WebSockets[req.session.userId].terminate();
            } catch (e) {
                return res.redirect('/');
            }
        }
    }

    openWebSocket(user, req) {
        // const ws = new WebSocket('ws://' + config.db.host + ':' + config.websocket.port);

        // // event emmited when connected
        // ws.onopen = function() {
        //     // sending a send event to websocket server
        //     ws.send('User with id: ' + user._id + ' connected');

        //     WebSockets[user._id] = ws;
        //     WebSockets[user._id]['user'] = user;
        // }

        // // event emmited when receiving message
        // ws.on('message', function(message) {
        //     console.log(message);
        // });

        // // event emmited when websocket is closed - on logout
        // ws.on('close', function(userId) {
        //     console.log(req.session.userId);
        //     delete ws[req.session.userId];
        //     delete WebSockets[req.session.userId];

        //     // delete session object
        //     req.session.destroy();

        // });
    }

    error(msg, status) {
        console.log(msg + ' Status:' + status);

    }

}

module.exports = new UserController();