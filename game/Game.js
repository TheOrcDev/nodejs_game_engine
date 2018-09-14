class Game {

    /*                                                         __
     *       ________              ________              _____/\_\
     *      /\       \            /\   __  \            /\   / / /
     *     /  \       \          /  \  \_\  \        __/_ \  \/_/ \
     *    /    \_______\        / /\ \_______\      /\___\ \_______\
     *    \    /       /        \ \/ /  __   /      \/___/ /  __   /
     *     \  /       /          \  /  /_/  /          \  /  /\ \ /
     *      \/_______/            \/_______/            \/___\ \_\
     *                                                        \/_/
     *
     */
    constructor(phaser) {
        this.socket = new WebSocket('ws://127.0.0.1:8088');

        this.playerMap = {};

        this.Socket();
        this.config = this.Config();
        this.phaser = phaser;
    }

    Config() {
        let config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: {
                preload: this.Preload,
                create: this.Create,
                update: this.Update
            }
        };

        return config;
    }

    Socket() {

        const self = this;
        this.socket.onopen = function(event) {
            self.game = new self.phaser.Game(self.config);
            self.socket.send('newplayer');
        };

    }

    getAllPlayers() {
        let allPlayers = [];

        this.socket.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            console.log(data);

            data.forEach((player) => {
                allPlayers[player.user._id] = {
                    x: player.coordinates.x,
                    y: player.coordinates.y
                };
            });
        });

        return allPlayers;
    }

    Preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png', { frameWidth: 32, frameHeight: 48 }
        );
    }

    Create() {
        this.add.image(400, 300, 'sky');

        let platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function(child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.score = 0;
        this.scoreText;

        this.physics.add.collider(this.stars, platforms);

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);

        Game.prototype.addPlayer(this, platforms);

    }

    Update() {
        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function(child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            this.bomb = this.bombs.create(x, 16, 'bomb');
            this.bomb.setBounce(1);
            this.bomb.setCollideWorldBounds(true);
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            this.bomb.allowGravity = false;

        }
    }

    addPlayer(self, platforms) {
        self.player = self.physics.add.sprite(100, 100, 'dude');

        self.physics.add.collider(self.player, platforms);

        self.player.setBounce(0.2);
        self.player.setCollideWorldBounds(true);

        self.anims.create({
            key: 'left',
            frames: self.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        self.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        self.anims.create({
            key: 'right',
            frames: self.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        self.physics.add.collider(self.player, platforms);
        self.physics.add.overlap(self.player, self.stars, Game.prototype.collectStar, null, self);
        self.physics.add.collider(self.player, self.bombs, Game.prototype.hitBomb, null, self);
    }

}