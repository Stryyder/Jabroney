	
	// Sound
	let sndFood = new Audio(); sndFood.src = "sound/sndFood.wav";
	let sndWater = new Audio (); sndWater.src = "sound/sndWater.wav";
	let sndEat = new Audio(); sndEat.src = "sound/sndEat.wav";
	let sndEnemyEat = new Audio(); sndEnemyEat.src = "sound/sndEnemyEat.wav";
	let sndOuch = new Audio(); sndOuch.src = "sound/sndOuch.wav";
	let sndHungry = new Audio(); sndHungry.src = "sound/sndHungry.wav";
	let sndThirsty = new Audio(); sndThirsty.src = "sound/sndThirsty.wav";
	let sndLevel = new Audio(); sndLevel.src = "sound/sndLevel.wav";
	let sndPickUpBomb = new Audio(); sndPickUpBomb.src = "sound/sndPickUpBomb.wav";
	let sndBomb = new Audio(); sndBomb.src = "sound/sndBomb.mp3";
	let sndTitle = new Audio(); sndTitle.src ="sound/sndTitle.mp3"; sndTitle.volume = 0.2;
	let sndCoin = new Audio(); sndCoin.src ="sound/sndCoin.wav";
	let sndSaucer = new Audio(); sndSaucer.src ="sound/sndSaucer.mp3";
	let sndZap = new Audio(); sndZap.src ="sound/sndZap.wav";
	let sndGameOver = new Audio(); sndGameOver.src ="sound/sndGameOver.mp3"; sndGameOver.volume = 0.2;
	// Graphics
	let imgSaucer = new Image(); imgSaucer.src ="img/imgSaucer.png";
	let imgFood = new Image(); imgFood.src ="img/imgFood.png";
	let imgWater = new Image(); imgWater.src ="img/imgWater.png";
	let imgGrid = new Image(); imgGrid.src = "img/imgGrid.jpg";
	let imgBomb = new Image(); imgBomb.src ="img/imgBomb.png";
	let imgTitle = new Image(); imgTitle.src = "img/imgTitle.jpg"; //eCommerce by BoxCat Games (Attribution)
	let imgCoin = new Image(); imgCoin.src = "img/imgCoin.png";
	let imgStatusBoard = new Image(); imgStatusBoard.src = "img/imgStatusBoard.png";
	
	// Double Canvas - Work to remove second canvas
	const cvs = document.getElementById("canvas").getContext("2d");
	const cvs2 = document.getElementById("statusBoard").getContext("2d");

	// Game Globals
	let level = 1;
	let highScore = 0; //localStorage.setItem(), clear(), removeItem() etc for high scores
	let teamScore = 0; // total team score for local storage
	let scoreRate = .1; 
	let numPlayers = 1;
	let starvationRate = 0.003;
	let fullnessBoost = 0.1;
	let hydrationBoost = 0.1;
	let skipPop = false;
	let enemies = [];
	let coinPoints = 100;
	let foodPoints = 115;
	let waterPoints = 120;
	let enemySpawnX = 500;
	let enemySpawnY = 500;
	
	
	let consumableItem = function(x, y, consumableType){
			this.x = x;
			this.y = y;
			this.type = consumableType;
	};
	
		let coin = new consumableItem (450, 450, "COIN");
		let food = new consumableItem (550, 550, "FOOD");
		let water = new consumableItem (150, 150, "WATER");	
	
	let gameBoard = {
		gameSpeed: 40,
		state: "Title",
		w: 600,
		h: 600,
		block: 10,
		blockM: 4,
		minX: 10,
		minY: 10,
		maxX: 580,
		maxY: 580,
		scoreModifier: 600
	};
	// Coordinates, name, color, tail color, score location coords
	let Player = function(x, y, name, c ,tc, statusX, statusY){
			this.isAlive = true;
			this.lives = 10;
			this.snake = [{x: x, y: y}]; 
			this.snakeX = 0;
			this.snakeY = 0;
			this.color = c;
			this.tailColor = tc;
			this.d = "DOWN";
			this.score = 0;
			this.fullness = 10;
			this.starving = false;
			this.hydration = 10;
			this.parched = false;
			this.name = name;
			this.skipPop = false;
			this.statusX = statusX;
			this.statusY = statusY;
						
	};

	
	let Enemy = function(x,y,c){
		this.x = x;
		this.y = y;
		this.color = c;
	};
	
	
	// Instantiate Players and Enemies
	let player1 = new Player(100,400, "Bob", "#80b3ff", "#ccddff", 50, 100);
	let player2 = new Player(200,400, "Carl", "#00ff00", "#b3ffb3", 50, 250);
	let player3 = new Player(300,400, "Jimmy", "#ff9900", "#ffd1b3", 50, 400);
		enemies.push(new Enemy(enemySpawnX,enemySpawnY, "red"));

		
	// PREVENT CANVAS SCROLLING WITH GAMEPLAY
	window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);	
		
		
	function drawGame(){
			clearBoard();
			
					function drawPlayerIfAlive(player){
							if (player.isAlive){
								boundaryCheck(player);
								drawStatus(player, player.statusX, player.statusY, player.color);
								drawPlayers(player);
								updateConsumableItems(player);

							}
					}
					
				// REDUCE FURTHER?
				drawPlayerIfAlive(player1);
				drawPlayerIfAlive(player2);
				drawPlayerIfAlive(player3);
					

				// General Draws
					updateLevel();
					drawEnemies();
				
				// Check for Game Over
				if ((player1.isAlive == false) && (player2.isAlive == false) && (player3.isAlive == false)){
					gameOver();
				}

		    }

	function direction(event){
		window.addEventListener("keydown", direction);		
		if (gameBoard.state == "Title"){ 
		gameBoard.state = "Play";
		sndTitle.play();
		sndTitle.loop = true;
		var gameLoop = setInterval(drawGame, gameBoard.gameSpeed);
		return; 
		}
		

			switch (event.keyCode){
				
				
				
				case 37:
					player1.d = "LEFT"; // 37 "LEFT Arrow"
					e.preventDefault();
					break;
					
				case 38:
					player1.d = "UP"; // 38 "UP Arrow"
					e.preventDefault();
					break;
					
				case 39:
					player1.d = "RIGHT"; // 39 "RIGHT Arrow"
					e.preventDefault();
					break;
				
				case 40:
					player1.d = "DOWN"; // 40 "DOWN Arrow"
					e.preventDefault();
					break;
					
				case 65:
					player2.d = "LEFT"; // 65 "A"
					break;
					
				case 87:
					player2.d = "UP"; // 87 "W"
					break;
					
				case 68:
					player2.d = "RIGHT"; // 68 "D"
					break;
				
				case 83:
					player2.d = "DOWN"; // 83 "S"
					break;
				
				case 73:
					player3.d = "UP"; // 65 "I"
					break;
					
				case 74:
					player3.d = "LEFT"; // 87 "J"
					break;
					
				case 75:
					player3.d = "DOWN"; // 68 "K"
					break;
				
				case 76:
					player3.d = "RIGHT"; // 83 "L"
					break;
					
				case 90:				// 90 "Z"
					gameBoard.gameSpeed += 10;
					break;
					
				// volume controls numpad +/- 107/109
				case 107:
					if (sndTitle.volume <= 0.8){sndTitle.volume += 0.1;}
					if (sndGameOver.volume <= 0.8){sndGameOver.volume += 0.1;}
					break;
					
				case 109:
					if (sndTitle.volume >= 0.1){sndTitle.volume -= 0.1;}
					if (sndGameOver.volume >= 0.1){sndGameOver.volume -= 0.1;}
					break;
		} 
		

	 }
	 

	function boundaryCheck(player){
			if (player.snake[0].x <= gameBoard.minX){player.snake[0].x = gameBoard.maxX-10;}		
			if (player.snake[0].y <= gameBoard.minY){player.snake[0].y = gameBoard.maxY-10;}		
			if (player.snake[0].x >= gameBoard.maxX){player.snake[0].x = gameBoard.minX+10;}		
			if (player.snake[0].y >= gameBoard.maxY){player.snake[0].y = gameBoard.minY+10;}
				
	 }
	 
	function playerResetOnLevelUp(){
					level += 1;
					starvationRate += 0.001;
					player1.fullness = 10;
					player2.fullness = 10;
					player3.fullness = 10;
					player1.hydration = 10;
					player2.hydration = 10;
					player3.hydration = 10;
					sndPickUpBomb.play();
			
		}
	 
	function updateLevel(){
			if ((player1.score + player2.score + player3.score)>= gameBoard.scoreModifier){
				gameBoard.scoreModifier += 200;	
				playerResetOnLevelUp();
				enemies.push(new Enemy(enemySpawnX,enemySpawnY, "white"));
				enemies.push(new Enemy(enemySpawnX,enemySpawnY, "white"));
				enemies.push(new Enemy(enemySpawnX,enemySpawnY, "#666699"));
					
			}
		}
			
	 


	function clearBoard(){
			
				cvs.clearRect(0, 0, gameBoard.w, gameBoard.h);
				cvs.drawImage(imgGrid, 10, 10);
				cvs2.clearRect(0, 0, 300, 600);
				cvs2.drawImage(imgStatusBoard, 0, 0);
				

	 }
	 
	function drawStatus(player, x, y, color){

					 
				// Scores and Level		
				if (player.isAlive){ player.score += scoreRate;	}
					cvs2.fillStyle = color;
					cvs2.font = "20px Arial";
					cvs2.fillText(player.name + ": " + parseInt(player.score), x, y);
					cvs2.fillText("Lives: " + player.lives, x, y + 20);
					cvs2.fillText("Fullness: " + parseInt(player.fullness), x, y + 40);
					cvs2.fillText("Hydration: " + parseInt(player.hydration), x, y + 60);
					cvs2.fillText("Length: " + parseInt(player.snake.length), x, y + 80);
					cvs2.fillStyle="white";
					cvs2.fillRect(210, 30, 100, 100);
					cvs2.fillStyle = "#000033";
					cvs2.font = "60px Arial";
					cvs2.fillText(level, 220, 120);
					cvs2.fillStyle = "red";
					cvs2.font = "15px Arial";
					cvs2.fillText("Mob Strength: " + enemies.length, x, 20);
	 
	 
				
				if (player.isAlive){
				
					// Health Bars
					for (let i = 0; i < player.lives; i++){
						cvs.fillStyle = "red";
						cvs.fillRect(player.snake[0].x - 11 + (i+15), player.snake[0].y - 11, 3, 3); 
					}
				
					// Fullness Bars
					for (let i = 0; i < player.fullness; i++){
						
						cvs.fillStyle = "green";
						cvs.fillRect(player.snake[0].x - 11 + (i+15), player.snake[0].y - 15, 3, 3); 
					}
					
					// Hydration Bars
					for (let i = 0; i < player.fullness; i++){
						cvs.fillStyle = "blue";
						cvs.fillRect(player.snake[0].x - 11 + (i+15), player.snake[0].y - 19, 3, 3); 
					}
				}

	 }
	 

	 
	function drawPlayers(player){
		 
		 	
			// Update player food and water levels
			player.fullness -= starvationRate;
			player.hydration -= starvationRate * 2;
			
			if (player.fullness <= 0) {	
				player.starving = true;
				player.fullness = 0;
			}else { player.starving = false; }
			
			if (player.hydration <= 0) {
				player.parched = true;
				player.hydration = 0;
			}else { player.parched = false; }
			
			
			// Drain score if parched or starving
			if ((player.parched) || (player.starving)){
				player.score -= starvationRate;
			}
			
			
			// Update Player location
			player.snakeX = player.snake[0].x;
			player.snakeY = player.snake[0].y;
			
			// If we ate stuff - don't pop the tail off the snake and let it grow
			if (!player.skipPop){
				player.snake.pop();
			}else {player.skipPop = false;
			}
			
			
			if (player.d == "RIGHT"){
				player.snake.unshift({x: player.snakeX + gameBoard.block, y: player.snakeY});
				
			}else if (player.d == "LEFT"){
				player.snake.unshift({x: player.snakeX - gameBoard.block, y: player.snakeY});
				
			}else if (player.d == "UP"){
				player.snake.unshift({x: player.snakeX, y: player.snakeY -= gameBoard.block});
				
			}else{
				player.snake.unshift({x: player.snakeX, y: player.snakeY += gameBoard.block});
			}
			
			
			// Draw the players	
			for (let i = 0; i < player.snake.length; i++){
				cvs.fillStyle = (i == 0)? player.color:player.tailColor;
				cvs.fillRect(player.snake[i].x, player.snake[i].y, gameBoard.block, gameBoard.block)
			}
			
			// See if we hit any bad guys
			for (let i = 0; i < enemies.length; i ++){
					checkForDamage(enemies[i], player);
				}

	 }
	 
	function drawEnemies(){
				enemyAI();
				for (let i = 0; i < enemies.length; i++){
					cvs.fillStyle = enemies[i].color;
					cvs.fillRect(enemies[i].x, enemies[i].y, gameBoard.block, gameBoard.block);
				}
	}
		 

	 
	 
	function enemyAI(){
		let moveAI = 0;
		
		
		for (let i = 0; i < enemies.length; i++){
		moveAI = Math.floor(Math.random() * 7) + 1;
				
				// even numbered enemies chase player1 or player3 X's
				if (i % 2 == 0){
					switch (moveAI){
							
						case 1:
							// don't move
							break;
						case 2: 
							if ((enemies[i].x <= player1.snake[0].x) && (player1.isAlive == true)){ enemies[i].x += gameBoard.block;} break;
						case 3: 
							if ((enemies[i].x >= player1.snake[0].x) && (player1.isAlive == true)){ enemies[i].x -= gameBoard.block;} break;
						case 4: 
							if ((enemies[i].y <= player1.snake[0].y) && (player1.isAlive == true)){ enemies[i].y += gameBoard.block;} break;
						case 5: 
							if ((enemies[i].y >= player1.snake[0].y) && (player1.isAlive == true)){ enemies[i].y -= gameBoard.block;} break;
						case 6:
							if ((enemies[i].x <= player3.snake[0].x) && (player3.isAlive == true)){ enemies[i].x += gameBoard.block;} break;
						case 7:
							if ((enemies[i].x >= player3.snake[0].x) && (player3.isAlive == true)){ enemies[i].x -= gameBoard.block;} break;
						
							
						default:
						break;
					}

						
				}else{
			// Odd numbered enemies chase player2 or player3 Y's
						switch (moveAI){
							
							case 1:
								// don't move
								break;
							case 2: 
								if ((enemies[i].x <= player2.snake[0].x) && (player2.isAlive == true)){ enemies[i].x += gameBoard.block;} break;
							case 3: 
								if ((enemies[i].x >= player2.snake[0].x) && (player2.isAlive == true)){ enemies[i].x -= gameBoard.block;} break;
							case 4: 
								if ((enemies[i].y <= player2.snake[0].y) && (player2.isAlive == true)){ enemies[i].y += gameBoard.block;} break;
							case 5: 
								if ((enemies[i].y >= player2.snake[0].y) && (player2.isAlive == true)){ enemies[i].y -= gameBoard.block;} break;
							case 6:
								if ((enemies[i].x <= player3.snake[0].y) && (player3.isAlive == true)){ enemies[i].y += gameBoard.block;} break;
							case 7:
								if ((enemies[i].x >= player3.snake[0].y) && (player3.isAlive == true)){ enemies[i].y -= gameBoard.block;} break;	
						
							default:
							break;
						}
					
					}	
		}
	}
	 
	function checkForDamage(enemy, player){
			if ((enemy.x == player.snake[0].x) && (enemy.y == player.snake[0].y) && (player.isAlive == true)){
					player.lives -= 1;
					if (player.lives <=0){player.isAlive = false;}
					player.score -= 100;
					sndOuch.play();
					
					player.snake[0].x = 20; player.snake[0].y = 20;
					cvs.fillStyle="red";
					cvs.fillRect(0,0,gameBoard.maxX, gameBoard.maxY);
		
			}
			
			/* Make players collide with each other
			if (player2.isAlive || player3.isAlive){
				
			}*/

		}
	 
	function updateConsumableItems(player){
		cvs.drawImage(imgCoin, coin.x, coin.y); 
		cvs.drawImage(imgFood, food.x, food.y); 
		cvs.drawImage(imgWater, water.x, water.y); 
		checkIfEaten(coin);
		checkIfEaten(food);
		checkIfEaten(water);
		
		
		function checkIfEaten(item){
			if ((player.snake[0].x == item.x) && (player.snake[0].y == item.y)){
				switch (item){
					case coin:
						player.score += coinPoints;
						sndCoin.play();
					break;
					case food:
						player.score += foodPoints;
						sndFood.play();
					break;
					case water:
						player.score += waterPoints;
						sndWater.play();
					break;
					default:
									
				}
				
					item.x = (gameBoard.block *(Math.floor(Math.random() * 50) + 1));
					item.y = (gameBoard.block *(Math.floor(Math.random() * 50) + 1));
					player.skipPop = true;
			}
		}
		

	}
	

	

	function gameOver(){
		//clearInterval(gameLoop);
		sndTitle.pause();
		sndGameOver.play();
		sndGameOver.loop = true;
		
		cvs2.fillStyle = "#ff3300";
		cvs2.font = "30px Arial";
		cvs2.fillText("GAME OVER!", 10, 100);
		
		cvs2.fillStyle = "white";
		cvs2.font = "15px Arial";
		cvs2.fillText(player1.name + " scored: " + parseInt(player1.score), 10, 120);
		cvs2.fillText(player2.name + " scored: " + parseInt(player2.score), 10, 140);
		cvs2.fillText(player3.name + " scored: " + parseInt(player3.score), 10, 160);
		
		cvs2.fillStyle = "#ffff00";
		cvs2.font = "15px Arial";
		cvs2.fillText("Team Score: " + parseInt(player3.score + player2.score + player1.score), 10, 180);
		
		// Keep high score records on local storage
			highScore = parseInt(localStorage.getItem("High Score"));
			teamScore = parseInt(localStorage.getItem("Highest Team Score"));
				if (player1.score > highScore){ highScore = player1.score; localStorage.setItem("By", player1.name);} 
				if (player2.score > highScore){ highScore = player2.score; localStorage.setItem("By", player2.name);}
				if (player3.score > highScore){ highScore = player3.score; localStorage.setItem("By", player3.name);}
			if ((player1.score + player2.score + player3.score) > teamScore){
				teamScore = player1.score + player2.score + player3.score;
			}
			teamScore = parseInt(teamScore);
			highScore = parseInt(highScore); // round it off
			localStorage.setItem("High Score", highScore.toString());
			localStorage.setItem("Highest Team Score", teamScore.toString());
		
		cvs2.fillStyle = "orange";
		cvs2.font = "10px Arial";
		cvs2.fillText("Highest Score: " + highScore, 10, 210);
		cvs2.fillText("By: " + localStorage.getItem("By"), 10, 240);			
		cvs2.fillText("Highest Team Score: " + localStorage.getItem("Highest Team Score"), 10, 270);	
		
		
	}
 function titleScreen(){
				
				cvs.fillStyle = "#000000";
				cvs.fillRect(0, 0, 600, 600);
				cvs.drawImage(imgTitle, 0, 0); 
					
					// Initialize Local Storage if it's empty
					if (localStorage.length == 0){
						localStorage.setItem("High Score", 0);
						localStorage.setItem("By", "No One!");
						localStorage.setItem("Highest Team Score", 0);
					}
				
			window.addEventListener("keydown", function(){
				// 49 -1 50 -2 51 -3
				switch (event.keyCode){
				
					case 49:
						// 1 player chosen
						player2.isAlive = false; 
						player3.isAlive = false;
						numPlayers = 1;
						direction();
						break;
					
					case 50:
						// 2 players chosen
						player3.isAlive = false;
						numPlayers = 2;
						direction();
					break;
					
					case 51:
						// 3 players chosen
						numPlayers = 3;
						direction();
					break;
				}
			});
			          
                           

	} 