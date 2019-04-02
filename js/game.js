$(document).ready(function () {

    var assets = {
        'skierCrash': 'img/skier_crash.png',
        'skierLeft': 'img/skier_left.png',
        'skierLeftDown': 'img/skier_left_down.png',
        'skierDown': 'img/skier_down.png',
        'skierRightDown': 'img/skier_right_down.png',
        'skierRight': 'img/skier_right.png',
        'tree': 'img/tree_1.png',
        'treeCluster': 'img/tree_cluster.png',
        'rhinoRun1': 'img/rhino_run_left.png',
        'rhinoRun2': 'img/rhino_run_left_2.png',
        'rhinoLift1': 'img/rhino_lift.png',
        'rhinoLift2': 'img/rhino_lift_mouth_open.png',
        'rhinoEat1': 'img/rhino_lift_eat_1.png',
        'rhinoEat2': 'img/rhino_lift_eat_2.png',
        'rhinoEat3': 'img/rhino_lift_eat_3.png',
        'rhinoEat4': 'img/rhino_lift_eat_4.png',
        'rock1': 'img/rock_1.png',
        'rock2': 'img/rock_2.png',
        'jump1': 'img/skier_jump_1.png',
        'jump2': 'img/skier_jump_2.png',
        'jump3': 'img/skier_jump_3.png',
        'jump4': 'img/skier_jump_4.png',
        'jump5': 'img/skier_jump_5.png',
        'ramp': 'img/jump_ramp.png'
    };
    var loadedAssets = {};

    var obstacleTypes = [
        'tree',
        'treeCluster',
        'rock1',
        'rock2',
        'ramp',
        'rhinoRun1',
        'rhinoRun2'
    ];

    var obstacles = [];

    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
    var canvas = $('<canvas></canvas>')
        .attr('width', gameWidth * window.devicePixelRatio)
        .attr('height', gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
    $('body').append(canvas);
    var ctx = canvas[0].getContext('2d');
    ctx.font = "30px Arial";

    var skierSpeed = 8;
    var rhinoSpeed = 4;
    // TODO Remove the defaults;
    var score = 0;
    var gameOver = false;
    var skierDirection = 5;
    var rhinoAction = 0;
    var skierMapX = 0;
    var skierMapY = 0;
    var rhinoMapX = 0;
    var isJumping = false;
    var jumpIteration = 0;
    var eatIteration = 0;
    var skierEaten = false;

    var resetGame = function () {
        score = 0;
        gameOver = false;
        skierDirection = 5;
        rhinoAction = 0;
        skierMapX = 0;
        skierMapY = 0;
        rhinoMapX = 0;
        isJumping = false;
        jumpIteration = 0;
        eatIteration = 0;
        skierEaten = false;
    }

    var clearCanvas = function () {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    var moveSkier = function () {
        switch (skierDirection) {
            case 2:
                skierMapX -= Math.round(skierSpeed / 1.4142);
                skierMapY += Math.round(skierSpeed / 1.4142);

                placeNewObstacle(skierDirection);
                break;
            case 3:
            case 10:
                skierMapY += skierSpeed;
                if (isJumping) {
                    jumpAnimationCycle();
                }
                placeNewObstacle(skierDirection);
                break;
            case 4:
                skierMapX += skierSpeed / 1.4142;
                skierMapY += skierSpeed / 1.4142;

                placeNewObstacle(skierDirection);
                break;
        }
    };

    var rhinoEatAnimationCycle = function () {
        eatIteration++;

        switch (true) {
            case (eatIteration <= 15):
                return loadedAssets.rhinoLift1;
                break;
            case (eatIteration > 15 && eatIteration <= 30):
                return loadedAssets.rhinoLift2;
                break;
            case (eatIteration > 30 && eatIteration <= 45):
                return loadedAssets.rhinoEat1;
                break;
            case (eatIteration > 45 && eatIteration <= 60):
                return loadedAssets.rhinoEat2;
                break;
            case (eatIteration > 60 && eatIteration <= 75):
                return loadedAssets.rhinoEat3;
                break;
            case (eatIteration > 75 && eatIteration <= 90):
                return loadedAssets.rhinoEat4;
                break;
            case (eatIteration > 90 && eatIteration <= 105):
                endGame();
                break;
        }
    };

    var endGame = function () {
        gameOver = true;

        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", (gameWidth / 2), (gameHeight / 2));

        ctx.font = "30px Arial";
        ctx.fillText("Final Score: " + score, (gameWidth / 2), (gameHeight / 2) + 50);
        ctx.fillText("Play Again? [y]", (gameWidth / 2), (gameHeight / 2) + 100);

    }

    var jumpAnimationCycle = function () {
        jumpIteration++;

        switch (true) {
            case (jumpIteration <= 15):
                return loadedAssets.jump1;
                break;
            case (jumpIteration > 15 && jumpIteration <= 30):
                return loadedAssets.jump2;
                break;
            case (jumpIteration > 30 && jumpIteration <= 45):
                return loadedAssets.jump3;
                break;
            case (jumpIteration > 45 && jumpIteration <= 60):
                return loadedAssets.jump4;
                break;
            case (jumpIteration > 60 && jumpIteration <= 75):
                return loadedAssets.jump5;
                break;
        }

        if (jumpIteration == 76) {
            jumpIteration = 0;
            isJumping = false;
            skierDirection = 3;
            return loadedAssets.skierDown;
        }
    };

    var getRhinoAsset = function () {
        switch (rhinoAction) {
            case 0:
                rhinoAssetName = 'rhinoRun1';
                break;
            case 1:
                rhinoAssetName = 'rhinoRun2';
                break;
            case 2:
                rhinoAssetName = 'rhinoLift1';
                break;
            case 3:
                rhinoAssetName = 'rhinoLift2';
                break;
            case 4:
                rhinoAssetName = 'rhinoLift3';
                break;
            case 5:
                rhinoAssetName = 'rhinoLift4';
                break;
            case 6:
                rhinoAssetName = 'rhinoLift5';
                break;
            case 6:
                rhinoAssetName = 'rhinoLift6';
                break;

        }
        return rhinoAssetName;
    }

    var getSkierAsset = function () {
        var skierAssetName;
        switch (skierDirection) {
            case 0:
                skierAssetName = 'skierCrash';
                break;
            case 1:
                skierAssetName = 'skierLeft';
                break;
            case 2:
                skierAssetName = 'skierLeftDown';
                break;
            case 3:
                skierAssetName = 'skierDown';
                break;
            case 4:
                skierAssetName = 'skierRightDown';
                break;
            case 5:
                skierAssetName = 'skierRight';
                break;
            case 10:
                skierAssetName = 'isJumping';
                break;

        }
        return skierAssetName;
    };

    var drawRhino = function () {
        var rhinoAssetName = getRhinoAsset();
        rhinoImage = loadedAssets[rhinoAssetName];

        var x = (gameWidth - rhinoImage.width) - rhinoMapX;
        var y = (gameHeight - rhinoImage.height) / 2;

        if (rhinoMapX >= ((gameWidth / 2) - rhinoImage.width)) {
            skierEaten = true;
            rhinoImage = rhinoEatAnimationCycle();
        } else {
            rhinoMapX += rhinoSpeed;
        }

        if (!gameOver) {
            ctx.drawImage(rhinoImage, x, y, rhinoImage.width, rhinoImage.height);
        }
    }

    var drawSkier = function () {
        var skierAssetName = getSkierAsset();
        if(skierAssetName == 'skierCrash') {
            endGame();
        }
        var skierImage = null;

        if (skierAssetName == 'isJumping') {
            skierImage = jumpAnimationCycle();
        } else {
            skierImage = loadedAssets[skierAssetName];
        }

        var x = (gameWidth - skierImage.width) / 2;
        var y = (gameHeight - skierImage.height) / 2;

        ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    };

    var drawObstacles = function () {
        var newObstacles = [];

        _.each(obstacles, function (obstacle) {
            var obstacleImage = loadedAssets[obstacle.type];
            var x = obstacle.x - skierMapX - obstacleImage.width / 2;
            var y = obstacle.y - skierMapY - obstacleImage.height / 2;

            if (x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) {
                return;
            }

            ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        obstacles = newObstacles;
    };

    var placeInitialObstacles = function () {
        var numberObstacles = Math.ceil(_.random(5, 7) * (gameWidth / 800) * (gameHeight / 500));

        var minX = -50;
        var maxX = gameWidth + 50;
        var minY = gameHeight / 2 + 100;
        var maxY = gameHeight + 50;

        for (var i = 0; i < numberObstacles; i++) {
            placeRandomObstacle(minX, maxX, minY, maxY);
        }

        obstacles = _.sortBy(obstacles, function (obstacle) {
            var obstacleImage = loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    };

    var placeNewObstacle = function (direction) {
        var scoreableDirection = [2, 3, 4];
        if (scoreableDirection.includes(direction)) {
            score += 1;
        }

        var shouldPlaceObstacle = _.random(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }

        var leftEdge = skierMapX;
        var rightEdge = skierMapX + gameWidth;
        var topEdge = skierMapY;
        var bottomEdge = skierMapY + gameHeight;

        switch (direction) {
            case 1: // left
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    };

    var placeRandomObstacle = function (minX, maxX, minY, maxY) {
        var obstacleIndex = _.random(0, obstacleTypes.length - 1);
        var obstacleType = obstacleTypes[obstacleIndex];

        if (obstacleType !== 'rhinoRun1' && obstacleType !== 'rhinoRun2') {
            var position = calculateOpenPosition(minX, maxX, minY, maxY);

            obstacles.push({
                type: obstacleType,
                x: position.x,
                y: position.y
            })
        }
    };

    var calculateOpenPosition = function (minX, maxX, minY, maxY) {
        var x = _.random(minX, maxX);
        var y = _.random(minY, maxY);

        var foundCollision = _.find(obstacles, function (obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if (foundCollision) {
            return calculateOpenPosition(minX, maxX, minY, maxY);
        } else {
            return {
                x: x,
                y: y
            }
        }
    };

    var checkIfSkierHitObstacle = function () {
        var skierAssetName = getSkierAsset();
        if (skierAssetName !== 'isJumping' && !isJumping) {
            var skierImage = loadedAssets[skierAssetName];
            var skierRect = {
                left: skierMapX + gameWidth / 2,
                right: skierMapX + skierImage.width + gameWidth / 2,
                top: skierMapY + skierImage.height - 5 + gameHeight / 2,
                bottom: skierMapY + skierImage.height + gameHeight / 2
            };

            var collision = _.find(obstacles, function (obstacle) {
                var obstacleImage = loadedAssets[obstacle.type];
                var obstacleRect = {
                    left: obstacle.x,
                    right: obstacle.x + obstacleImage.width,
                    top: obstacle.y + obstacleImage.height - 5,
                    bottom: obstacle.y + obstacleImage.height
                };

                var hadCollision = intersectRect(skierRect, obstacleRect);
                if (hadCollision && obstacle.type == 'ramp') {
                    isJumping = true;
                    skierDirection = 10;
                    return false;
                } else {
                    return hadCollision;
                }
            });

            if (collision) {
                skierDirection = 0;
            }
        }
    };

    var intersectRect = function (r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };

    var gameLoop = function () {
        if (!gameOver) {
            ctx.save();

            // Retina support
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            clearCanvas();

            if (!skierEaten) {
                moveSkier();
                checkIfSkierHitObstacle();
                drawSkier();
            }

            if (score > 500) {
                drawRhino();
            }

            drawObstacles();

            ctx.fillText("Score: " + score, 10, 50);
            ctx.restore();
        }

        requestAnimationFrame(gameLoop);
    };

    var loadAssets = function () {
        var assetPromises = [];

        _.each(assets, function (asset, assetName) {
            var assetImage = new Image();
            var assetDeferred = new $.Deferred();

            assetImage.onload = function () {
                assetImage.width /= 2;
                assetImage.height /= 2;

                loadedAssets[assetName] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = asset;

            assetPromises.push(assetDeferred.promise());
        });

        return $.when.apply($, assetPromises);
    };

    var setupKeyhandler = function () {
        $(window).keydown(function (event) {
            if (!isJumping) {
                switch (event.which) {
                    case 37: // left
                        if (skierDirection === 1) {
                            skierMapX -= skierSpeed;
                            placeNewObstacle(skierDirection);
                        } else {
                            skierDirection === 0 ? skierDirection++ : skierDirection--;
                        }
                        event.preventDefault();
                        break;
                    case 39: // right
                        if (skierDirection === 5) {
                            skierMapX += skierSpeed;
                            placeNewObstacle(skierDirection);
                        } else {
                            skierDirection++;
                        }
                        event.preventDefault();
                        break;
                    case 38: // up
                        if (skierDirection === 1 || skierDirection === 5) {
                            skierMapY -= skierSpeed;
                            placeNewObstacle(6);
                        }
                        event.preventDefault();
                        break;
                    case 40: // down
                        skierDirection = 3;
                        event.preventDefault();
                        break;
                }
            }

            if (gameOver && event.which == 89) {
                resetGame();
                initGame(gameLoop);
            }
        });
    };

    var initGame = function () {
        setupKeyhandler();
        loadAssets().then(function () {
            resetGame();
            placeInitialObstacles();

            requestAnimationFrame(gameLoop);
        });
    };

    initGame(gameLoop);
});