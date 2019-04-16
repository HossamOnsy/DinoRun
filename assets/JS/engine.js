var tempCharIdx = 0;
document.getElementById("char1").onclick = function () {
    tempCharIdx = 0;
}
document.getElementById("char2").onclick = function () {
    tempCharIdx = 1;
}
document.getElementById("subok").onclick = function (e) {
    document.getElementById("settmenu").style.display = "none";
}
document.getElementById("start").onclick = function () {
    function startGame() {
        document.getElementById("firstPage").style.display = "none";
        document.getElementById("gamePage").style.display = "block";
        var levelsElements = document.getElementsByName("levels");
        var graphicsElements = document.getElementsByName("Graphics");
        var canvas = document.getElementById("can");
        var context = canvas.getContext("2d");
        var audio = document.getElementsByTagName("audio");
        context.font = '25px Lucida Handwriting';

        var gameObjects = [];

        var backGrounds = {
            ground: ['assets/images/ground.png'],
            sky: ['assets/images/background.png'],
            pause: 'assets/images/pause.png',
            gameOver: 'assets/images/game over.png',
        };
        var types = {
            character: ['assets/images/dino1.png', 'assets/images/dino2.png'],
            invincibleCharachter: ['assets/images/cloud-design.png'],
            cloud: ['assets/images/cloud-design.png'],
            cactus: ['assets/images/cactus.png'],
            life: 'assets/images/red-heart.png',
            bird: ''
        };
        var sounds = {
            music: 'assets/sounds/music.mp3',
            jump: 'assets/sounds/jump.wav',
            hit: 'assets/sounds/hit.wav'
        };
        var gameOptions = {
            level: 0,
            characterIdx: tempCharIdx,
            difficulty: 3,
            graphicsQuality: 3,
            numOfLives: 3,
            lives: [],
            invincible: false,
            mute: false,
            collisionErrorMargin: 15,
            makeInvincible: function () {
                //myCharachter.figure.src = types.invincibleCharachter[gameOptions.characterIdx];
                context.globalAlpha = 0.2;
                myCharachter.figure.style.opacity = "0.1";
                gameOptions.invincible = true;
                setTimeout(function () {
                    myCharachter.figure.src = types.character[gameOptions.characterIdx];
                    gameOptions.invincible = false;
                    context.globalAlpha = 1;
                }, 1000);
            },
            muteSound:function(){
            for(s of audio)
            s.muted=true;
        }
        };

        if(document.getElementById('soundpicmenu').getAttribute('name')=='muted')
            gameOptions.muteSound()
        for (var i = 0; i < levelsElements.length; ++i) {
            if (levelsElements[i].checked) {
                gameOptions.difficulty = levelsElements[i].value;
                break;
            }
        }
        for (var i = 0; i < graphicsElements.length; ++i) {
            if (graphicsElements[i].checked) {
                gameOptions.graphicsQuality = graphicsElements[i].value;
                break;
            }
        }


        var level = function () {
            this.ground = new Image(),
                this.ground.src = backGrounds.ground[gameOptions.level],
                this.sky = new Image(),
                this.sky.src = backGrounds.sky[gameOptions.level],
                this.pausePic = new Image(),
                this.pausePic.src = backGrounds.pause,
                this.gameOverPic = new Image(),
                this.gameOverPic.src = backGrounds.gameOver
        }
        var thisLevel = new level();

        var customGameObject = function (imgPath, xCoordinate, yCoordinate, desiredWidth, desiredHeight) {
            this.figure = new Image(),
                this.figure.src = imgPath,
                this.xCoord = xCoordinate,
                this.yCoord = yCoordinate,
                this.width = desiredWidth,
                this.height = desiredHeight
        }
        customGameObject.prototype.plot = function () {
            context.drawImage(this.figure, this.xCoord, this.yCoord, this.width, this.height);
        }
        customGameObject.prototype.collide = function () {};
        customGameObject.prototype.reDraw = function () {};
        customGameObject.prototype.move = function () {};

        var obstacle = function (xCoordinate, yCoordinate, desiredWidth, desiredHeight) {
            customGameObject.call(this, types.cactus[gameOptions.level], xCoordinate, yCoordinate, desiredWidth, desiredHeight);
        }
        obstacle.prototype = Object.create(customGameObject.prototype);
        obstacle.prototype.collide = function () {
            if (!gameOptions.invincible) {
                audio[2].play();
                gameOptions.numOfLives--;
                gameOptions.makeInvincible();
                if (gameOptions.numOfLives == 0) {
                    pause = true;
                    audio[0].pause();
                    context.globalAlpha = 1;
                    context.drawImage(thisLevel.gameOverPic, 440, 150, 425, 200); //this for draw gameover image 
                    window.addEventListener("keydown", restartGame, false); //this apply again key
                    //window.removeEventListener("keydown", Pause, false); //this remove pause event
                    //again(); //this call again function
                }
            }
        }
        obstacle.prototype.reDraw = function () {
            this.xCoord = Math.floor((Math.random() * 1000)) + 1400;
            var f = Math.floor((Math.random() * 60) + 50);
            this.yCoord -= f - this.height;
            this.height = f;

        }
        obstacle.prototype.move = function () {
            this.xCoord -= gamespeed;
        }
        var decoration = function (xCoordinate, yCoordinate, desiredWidth, desiredHeight) {
            customGameObject.call(this, types.cloud[gameOptions.level], xCoordinate, yCoordinate, desiredWidth, desiredHeight);
            this.speed = (Math.random() * 5) + 3;
        }
        decoration.prototype = Object.create(customGameObject.prototype);
        decoration.prototype.reDraw = function () {
            this.xCoord = (Math.floor(Math.random() * 800) + 800) + Math.floor((Math.random() + Math.random()) * 500 + 200)
            this.yCoord = Math.floor((Math.random() * 200) + 50)
            this.width = Math.floor((Math.random() * 51) + 60)
            this.height = Math.floor((Math.random() * 31) + 30)
            this.speed = (Math.random() * 5) + 3;
        }
        decoration.prototype.move = function () {
            this.xCoord -= gamespeed - this.speed;
        }
        var charachter = function (xCoordinate, yCoordinate, desiredWidth, desiredHeight) {
            customGameObject.call(this, types.character[gameOptions.characterIdx], xCoordinate, yCoordinate, desiredWidth, desiredHeight);
        }
        charachter.prototype = Object.create(customGameObject.prototype);

        var life = function (xCoordinate, yCoordinate, desiredWidth, desiredHeight) {
            customGameObject.call(this, types.life, xCoordinate, yCoordinate, desiredWidth, desiredHeight);
        }
        life.prototype = Object.create(customGameObject.prototype);


        function checkCollisions() {
            for (let i = 0; i < gameObjects.length; i++) {
                //todo get boundaries and set a new random xcoord
                if (
                    gameObjects[i].xCoord > myCharachter.xCoord &&
                    gameObjects[i].xCoord < myCharachter.xCoord + myCharachter.width - gameOptions.collisionErrorMargin
                    /*||
                    gameObjects[i].xCoord + gameObjects[i].width > myCharachter.xCoord &&
                    gameObjects[i].xCoord + gameObjects[i].width < myCharachter.xCoord + myCharachter.width - gameOptions.collisionErrorMargin*/
                )
                    if (gameObjects[i].yCoord > myCharachter.yCoord && gameObjects[i].yCoord < myCharachter.yCoord + myCharachter.height - gameOptions.collisionErrorMargin) {
                        gameObjects[i].collide();
                    }

                if (gameObjects[i].xCoord < (Math.floor(Math.random() * -100) + 50) - Math.floor(Math.random() - Math.random() * -50) - 270)
                    gameObjects[i].reDraw();


            }

        }

        var groundcoordinate = 0; //initial value for draw x coordinate

        var jumpspeed = 0; //initial value for jump speed 
        var jumpoverspeed = 0; //speed when press down key

        var pause = false; //general value for game and when you press enter the value will be true
        var gamespeed = 7; //the speed of game
        var score = 0; //the score counter

        var width = canvas.width; //the width of the page
        var height = canvas.height; //the height of the page

        var myCharachter = new charachter(0, height - 160, 80, 120);

        for (let i = 0; i < gameOptions.graphicsQuality; i++) {
            //todo
            //fill params with relative random valid values
            gameObjects.push(new decoration(0, 0, 0, 0));
        }
        for (let i = 0; i < gameOptions.difficulty; i++) {
            //todo
            //fill params with relative random valid values
            gameObjects.push(new obstacle(0, 600, 50, 0));
        }

        for (let i = 0; i < gameOptions.numOfLives; i++) {
            gameOptions.lives.push(new life(i * 50, 80, 50, 50));
            gameOptions.lives[i].src = types.life;
        }

        if (gameOptions.mute) {
            for (let i = 0; i < audio.length; i++) {
                audio[i].muted = true;
            }
        }

        function game() { //this function is called continuously to apply animations
            if (!pause) //check if pause=true the game will paused
            {
                context.drawImage(thisLevel.sky, 0, 0, width, height); //draw the sky background

                for (let i = 0; i < gameObjects.length; i++) {

                    gameObjects[i].plot();
                    gameObjects[i].move();
                }
                myCharachter.plot();
                context.drawImage(thisLevel.ground, groundcoordinate, height - 60, width, 60); //this draw the green ground floor
                context.drawImage(thisLevel.ground, width + groundcoordinate - 5, height - 60, width, 60); //this for repeat the ground

                for (let i = 0; i < gameOptions.numOfLives; i++)
                    gameOptions.lives[i].plot();

                myCharachter.yCoord -= jumpspeed;

                groundcoordinate -= gamespeed; //this minus the x coordinate of the green ground to move with game speed

                if (width + groundcoordinate <= 0) { //this condition for repeat the green ground from right after it moves through left
                    groundcoordinate = -6;
                }

                checkCollisions();
                if (myCharachter.yCoord < myCharachter.height + 250) {

                    jumpspeed -= 2 + jumpoverspeed; //this condition for return the dinasor down again to the ground after jump and if down key pressed the speed value increments
                }

                if (myCharachter.yCoord >= height - 160) {
                    myCharachter.yCoord = height - 160; //this condition for stop the dinasor when he return back to the ground after jump
                    jumpspeed = 0;
                }
                
                //context.fillText("Player :" + document.getElementById("userName").textContent, 1165, 20);
                context.fillText("Score :" + score++, 1165, 40);
                context.fillText("Speed :" + Math.floor(gamespeed), 1165, 60);
                gamespeed += gameOptions.difficulty / 1000; //increment the game speed

                window.requestAnimationFrame(game); //this call the game function continuously to apply animation

            }
        }

        function handleKey(e) {
            e.preventDefault();
            if (jumpspeed == 0) { //this condition for make sure that the dinasor in the ground before next jump

                if (e.keyCode == 32 || e.keyCode == 38) //test the key code of keyboard (space or up)
                {
                    audio[1].play();
                    jumpspeed = 25; //for move the dinasor
                    jumpoverspeed = 0; //for return it to its initial value
                }
            }
            if (e.keyCode == 40) { //test the key code of keyboard (down) for increment the down speed
                jumpoverspeed = 5; //for increment the down speed when he returns back
            }
            if (e.keyCode == 13) { //test the key code of keyboard (enter) for pause the game
                if (gameOptions.numOfLives) {
                    pause = !pause;
                    if (pause) {
                        audio[0].pause();
                        context.drawImage(thisLevel.pausePic, 595, 185, 150, 150); //draw pause image
                    } else
                        audio[0].play();
                    game();
                }
            }
        }

        function restartGame(e) {
            e.preventDefault();
            if (e.keyCode == 32) //test the key code of keyboard (space) for refresh
            {
                location.reload()
            }
        }

        audio[0].play();
        game(); //call the game in start
        window.addEventListener("keydown", handleKey, false);

    }
    startGame();
}
