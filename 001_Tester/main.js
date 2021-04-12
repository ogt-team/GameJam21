let player = {
    shootCooldown: 300,
    lastShootTimestamp:0,
    x: 0,
    y: 0,
    height:10,
    width: 10,
    widthHalf: 5,
    heightHalf: 5,
    dir_x:0,
    dir_y:1,
    kills:0
  },
  maxAliveMonsters = 20,
  monsters = [],
  bullets = [],
  intersect = function (a, b) {
    let intersect = true;
    if (a.x - a.widthHalf > b.x + b.widthHalf || b.x - b.widthHalf > a.x + a.widthHalf) {
        intersect = false;
    }
    if (a.y - a.heightHalf > b.y + b.heightHalf|| b.y - b.heightHalf > a.y + a.heightHalf) {
        intersect = false;
    }
    return intersect;
  },
  engine = cEngine.create({
    autoClear: false,
    height: 512,
    plugins: {
        input: cEngine.input.create(),
        activityTracker: cEngine.activityTracker.create({
            stopOnUserLeave: true
        }),
        stats: cEngine.stats.create(),
        fill: cEngine.fill.create({
            mode: 'stretch',
            aspectRetion: true
        }),
        frameRate: cEngine.frameRate.create({
            fps: 60
        })
    },
    step: (context, width, height, stepTimeElapsed) => {

        engine.clear();

        // Player Logic

        let playerOldX = player.x;
        let playerOldY = player.y;
        let change = false;

        if (engine.plugins.input.keys.W) {
            player.y--;
            change = true;
        }
        if (engine.plugins.input.keys.A) {
            player.x--;
            change = true;
        }
        if (engine.plugins.input.keys.S) {
            player.y++;
            change = true;
        }
        if (engine.plugins.input.keys.D) {
            player.x++;
            change = true;
        }

        if (player.x < 0) { player.x = 0; }
        if (player.y < 0) { player.y = 0; }
        if (player.x > width) { player.x = width; }
        if (player.y > height) { player.y = height; }

        if (change) {
            player.dir_x = playerOldX - player.x;
            player.dir_y = playerOldY - player.y;
        }

        if (engine.plugins.input.keys.SPACE) {
            if ((new Date().getTime() - player.lastShootTimestamp) > player.shootCooldown) {
                player.lastShootTimestamp = new Date().getTime();
                bullets.push({
                    width: 2,
                    height: 2,
                    widthHalf: 1,
                    heightHalf: 1,
                    x:player.x + (player.width/2) - 1,
                    y:player.y + (player.height/2) - 1,
                    dir_x: player.dir_x,
                    dir_y: player.dir_y,
                    alive: true,
                    created: new Date().getTime(),
                    lifeTime: 2000
                });
            }
        }

        // Bullets Logic
        bullets.forEach(b => {
            if (b.alive) {
                if ((new Date().getTime() - b.created) > b.lifeTime) {
                    b.alive = false;
                } else {
                    b.x -= (b.dir_x * 2);
                    b.y -= (b.dir_y * 2);
                }

                monsters.forEach(m => {
                    if (m.alive) {
                        if (intersect(b, m)) {
                            m.alive = false;
                            player.kills += 1;
                        }
                    }
                })
            }
        })

        // Monster logic
        let countAliveMonsters = monsters.filter(m => m.alive).length;
        if (Math.random() > 0.99 && countAliveMonsters < maxAliveMonsters) {
            monsters.push({
                width: 20,
                height: 20,
                widthHalf: 10,
                heightHalf: 10,
                x:Math.random() * width,
                y:Math.random() * height,
                dir_x: Math.random(),
                dir_y: Math.random(),
                alive: true,
                created: new Date().getTime(),
                lifeTime: 2000
            });
        }

        monsters.forEach(m => {
            if (m.alive) {
                m.x -= m.dir_x;
                m.y -= m.dir_y;

                if (m.x < 0) { m.x = 0; }
                if (m.y < 0) { m.y = 0; }
                if (m.x > width) { m.x = width; }
                if (m.y > height) { m.y = height; }
                if (intersect(player, m)) {
                    engine.stop();
                    location.reload();
                }
            }
        })

        // Player Draw
        context.fillStyle = 'red'
        context.fillRect(player.x, player.y, player.width, player.height)

        // Draw UI
        context.font = "12px Arial";
        context.fillText("move - wasd, shoot - space", 10, 12);
        context.fillText("Player Kills: " + player.kills, 10, 26);
        context.fillText("Alive Monsters: " + monsters.filter(m => m.alive).length, 10, 40);

        // Bullets Draw
        context.fillStyle = 'blue'
        bullets.forEach(b => {
            if (b.alive) {
                context.fillRect(b.x, b.y, b.width, b.height)
            }
        })

        // Bullets Draw
        context.fillStyle = 'black';
        monsters.forEach(m => {
            if (m.alive) {
                context.fillRect(m.x, m.y, m.width, m.height)
            }
        })
    }
  })

engine.start()