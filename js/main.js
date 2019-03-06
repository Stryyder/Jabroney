	// Jabroney - by Toby
	
	// Sound
	let sndTROJANS = new Audio(); sndTROJANS.src = "sound/sndTROJANS.wav";
	let sndMEMORYLEAKS = new Audio (); sndMEMORYLEAKS.src = "sound/sndMEMORYLEAKS.wav";
	let sndEat = new Audio(); sndEat.src = "sound/sndEat.wav";
	let sndOuch = new Audio(); sndOuch.src = "sound/sndOuch.wav";
	let sndHungry = new Audio(); sndHungry.src = "sound/sndHungry.wav";
	let sndThirsty = new Audio(); sndThirsty.src = "sound/sndThirsty.wav";
	let sndLevel = new Audio(); sndLevel.src = "sound/sndLevel.wav";
	let sndPickUpBomb = new Audio(); sndPickUpBomb.src = "sound/sndPickUpBomb.wav";
	let sndBomb = new Audio(); sndBomb.src = "sound/sndBomb.mp3";
	let sndTitle = new Audio(); sndTitle.src ="sound/sndTitle.mp3"; sndTitle.volume = 0.2;
	let sndBADFILES = new Audio(); sndBADFILES.src ="sound/sndBADFILES.wav";
	let sndSaucer = new Audio(); sndSaucer.src ="sound/sndSaucer.mp3";
	let sndZap = new Audio(); sndZap.src ="sound/sndZap.wav";
	let sndGameOver = new Audio(); sndGameOver.src ="sound/sndGameOver.mp3"; sndGameOver.volume = 0.2;
	let sndLevelUp = new Audio(); sndLevelUp.src="sound/sndLevelUp.wav";
	let sndEnemyPickup = new Audio(); sndEnemyPickup.src="sound/sndEnemyPickup.wav";
	let sndTrash = new Audio(); sndTrash.src="sound/sndTrash.mp3";
	// Graphics
	let imgSaucer = new Image(); imgSaucer.src ="img/imgSaucer.png";
	let imgTROJANS = new Image(); imgTROJANS.src ="img/imgTROJANS.png";
	let imgMEMORYLEAKS = new Image(); imgMEMORYLEAKS.src ="img/imgMEMORYLEAKS.png";
	let imgGrid = new Image(); imgGrid.src = "img/imgGrid.jpg";
	let imgBomb = new Image(); imgBomb.src ="img/imgBomb.png";
	let imgTitle = new Image(); imgTitle.src = "img/imgTitle.jpg"; //eCommerce by BoxCat Games (Attribution)
	let imgBADFILES = new Image(); imgBADFILES.src = "img/imgBADFILES.png";
	let imgTrash = new Image(); imgTrash.src = "img/imgTrash.png";
	
	
	// Drawing Board
	const cvs = document.getElementById("canvas").getContext("2d");
	

	// Game Globals
	let level = 1;
	let highScore = 0; //localStorage.setItem(), clear(), removeItem() etc for high scores
	let teamScore = 0; // total team score for local storage
	let scoreRate = .1; // score earned by just being alive
	let numPlayers = 1;
	let whoIsAliveCode = 1; // code based on every possible occurence of players being alive or dead
	let starvationRate = 0.003; // rate at which you starve by not eating files
	let skipPop = false;
	let enemies = [];
	let customerStatus = "Perfectly happy";
	let gameDifficulty = 10; 
	let BADFILESPoints = 50;
	let TROJANSPoints = 55;
	let MEMORYLEAKSPoints = 70;
	let enemySpawn = [500, 500];
	let trashCoords = [80, 80];
	let trashDropped = 0;
	let warp = [60, 60, 180, 180]; // possible warp zone block from x,y to x,y
	
	
	let consumableItem = function(x, y, consumableType){
			this.x = x;
			this.y = y;
			this.type = consumableType;
	};
	
		let BADFILES = new consumableItem (450, 450, "BADFILES");
		let TROJANS = new consumableItem (550, 550, "TROJANS");
		let MEMORYLEAKS = new consumableItem (150, 150, "MEMORYLEAKS");	
	
	let gameBoard = {
		gameSpeed: 50, // higher number - higher interval = slower gameplay
		projectileSpeed: 6750,
		state: "Title",
		w: 600,
		h: 770,
		block: 10,
		blockM: 4,
		minX: 0,
		minY: 0,
		maxX: 570,
		maxY: 570,
		scoreModifier: 1000 // 1000 for traditional game play
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
			this.BADFILES = 0; 
			this.TROJANS = 0;
			this.MEMORYLEAKS = 0;
			this.fullness = 10;
			this.starving = false;
			this.hydration = 10;
			this.parched = false;
			this.name = name;
			this.skipPop = false;
			this.statusX = statusX;
			this.statusY = statusY;
						
	};

	
	let Enemy = function(x,y,c,s,t){
		this.x = x;
		this.y = y;
		this.color = c;
		this.size = s;
		this.type = t;
		this.projectilePosition = [0, 0];
	};
	

	
	
	// Instantiate Players and Enemies
	let player1 = new Player(100,400, "Bob", "#80b3ff", "#ccddff", 20, 100);
	let player2 = new Player(200,400, "Carl", "#00ff00", "#b3ffb3", 220, 100);
	let player3 = new Player(300,400, "Jimmy", "#ff9900", "#ffd1b3", 420, 100);
	
	
	
		
	// PREVENT CANVAS SCROLLING WITH GAMEPLAY
	window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);	
		
	
	function setupGame(){
		// Add initial enemies
		switch(numPlayers){
			case 1:
				
				enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 10, "MOB"));
	
			break;
			case 2:
				enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 10, "MOB"));
				enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 10, "MOB"));
			break;
			case 3:
				enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 10, "MOB"));
				enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 10, "MOB"));
				enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 10, "MOB"));
			break;
			default:
			
			break;
		}
		
	}
	
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
					break;
					
				case 38:
					player1.d = "UP"; // 38 "UP Arrow"
					break;
					
				case 39:
					player1.d = "RIGHT"; // 39 "RIGHT Arrow"
					break;
				
				case 40:
					player1.d = "DOWN"; // 40 "DOWN Arrow"
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
	function enemyBoundaryCheck(enemy){
			if (enemy.x <= gameBoard.minX){enemy.x = gameBoard.maxX-10;}		
			if (enemy.y <= gameBoard.minY){enemy.y = gameBoard.maxY-10;}		
			if (enemy.x >= gameBoard.maxX){enemy.x = gameBoard.minX+10;}		
			if (enemy.y >= gameBoard.maxY){enemy.y = gameBoard.minY+10;}
				
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
					
			
		}
	 
	function updateLevel(){
			if ((player1.score + player2.score + player3.score)>= gameBoard.scoreModifier){
				
					
					sndLevelUp.play();
					cvs.fillStyle="blue";
					cvs.fillRect(0,0,gameBoard.maxX, gameBoard.maxY);
					enemies = [];
				
				gameBoard.scoreModifier += 400;
				gameDifficulty += 1;
				playerResetOnLevelUp();
				let mobColor = "white";
				
				
				
				
				
				switch (true){
					
					case level <= 5:
						mobColor = "red";
					break;
					
					case level > 5 && level <= 10:
						mobColor = "white";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "white", 20, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "a little sick";
						
					break;
					
					case level > 11 && level <= 20:
						mobColor = "green";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "#222222", 30, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "puking";
					break;
					
					case level > 21 && level <= 30:
						mobColor = "yellow";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "#111111", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "panicky";
					break;
					
					case level > 31 && level <= 40:
						mobColor = "#666699";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "#343434", 20, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "#434343", 20, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "insane";
					break;
					
					case level > 41 && level <= 50:
						mobColor = "#EAEAEB";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "#565656", 30, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "#656565", 30, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "febrile";
					break;
					
					case level > 51 && level <= 60:
						mobColor = "#222";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "suicidal";
						gameDifficulty += 3;
					break;
					
					case level > 61 && level <= 70:
						mobColor = "cyan";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "hot garbage";
						gameDifficulty += 5;
					break;
					
					case level > 71:
						mobColor = "black";
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 20, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 30, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "black", 40, "FAT"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], "red", 20, "SHOOTER"));
						customerStatus = "writing a will";
						gameDifficulty += 10;
					break;
					
				}
				
									
					for (let i=0; i < numPlayers * gameDifficulty; i++){
						enemies.push(new Enemy(enemySpawn[0],enemySpawn[1], mobColor, 10));
					}
				
				
			}
		}
			
	 


	function clearBoard(){
			
				cvs.clearRect(0, 0, gameBoard.w, gameBoard.h);
				cvs.drawImage(imgGrid, 0, 0);
				cvs.drawImage(imgTrash, trashCoords[0], trashCoords[1]);
				
				
				

	 }
	 
	function drawStatus(player, x, y, color){

					 
				// Scores and Level		
				if (player.isAlive){ player.score += scoreRate;	}
				
				
					cvs.fillStyle = color;
					cvs.font = "24px Arial";
					cvs.fillText(player.name + ": " + parseInt(player.score), x, 640);
					cvs.fillText("Nerves: " + player.lives, x, 660);
					cvs.fillText("Trashed: " + parseInt(trashDropped), x, 760);
										
					cvs.fillStyle = "red";
					cvs.font = "16px Arial";
					cvs.fillText("Level: " + level, 100, 610);
					cvs.fillStyle = "yellow";
					cvs.fillText("Customer: " + customerStatus, 200, 610);
					cvs.fillStyle = "#F781F3";
					cvs.fillText("Infection Stage: " + enemies.length, 425, 610);
					
					
	 
	 
				
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
		 
		 	
			// Update player Trojans and Memory Leaks levels (fullness/thirst attributes atm)
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
			
			// See if we hit any bad guys or if bad guys hit food
			for (let i = 0; i < enemies.length; i ++){
					checkForDamage(enemies[i], player);
				
				
			
			}

	}
	 
	function drawEnemies(){
				enemyAI(); // move the AI around before painting enemies
				
				projectileAI(); // move the bullets around before painting bullets
				// Paint the enemies
				for (let i = 0; i < enemies.length; i++){
					enemyBoundaryCheck(enemies[i]);
					cvs.fillStyle = enemies[i].color;
					cvs.fillRect(enemies[i].x, enemies[i].y, enemies[i].size, enemies[i].size);
				}
	}
		 
	
	 
	 
	function enemyAI(){
		// numPlayers
		
		let moveAI = 0;
			// Give each enemy a randomized-ish action but trending towards a player it's chasing 
			
			// ONE PLAYER
		if (numPlayers == 1){executeAI(player1, 0, 1);
		}else if (numPlayers == 2){
							
							// 2 player game
							if (player1.isAlive && (!player2.isAlive)){executeAI(player1, 0, 1);}
							if (player2.isAlive && (!player1.isAlive)){executeAI(player2, 0, 1);}
							if (player1.isAlive && player2.isAlive){
								executeAI(player1, 0, 2);
								executeAI(player2, 1, 2);
							}
			}else{
							/* 3 player game 
							 WHO'S ALIVE CODES as determined by seeWhoIsAlive()
							 1:1, 1+2:3, 1+3:4 
							 2:2, 2+3:5
							 3:6
							 all alive: 7
							 								
							*/
							seeWhoIsAlive();
							switch(whoIsAliveCode){
								
								case 1: // Alive: Player 1
									executeAI(player1, 0, 1);
								break;
								case 2: // Alive: Player 2
									executeAI(player2, 0, 1);
								break;
								case 3: // Alive: Player 1 & 2
									executeAI(player1, 0, 2);
									executeAI(player2, 1, 2);
								break;
								case 4: // Alive: Player 1 & 3
									executeAI(player1, 0, 2);
									executeAI(player3, 1, 2);
								break;
								case 5: // Alive: Player 2 & 3
									executeAI(player2, 0, 2);
									executeAI(player3, 1, 2);
								break;
								case 6: // Alive: Player 3
									executeAI(player3, 0, 1);
								break;
								case 7: // All alive
									executeAI(player1, 0, 3);
									executeAI(player2, 1, 3);
									executeAI(player3, 2, 3);
								break;
								default:
								break;
							}
							
							
							
							
				}
	
	
		function seeWhoIsAlive(){
			
			// player1-based
			if (player1.isAlive && (!player2.isAlive) && (!player3.isAlive)){ 
				return whoIsAliveCode = 1;
			}
			if (player1.isAlive && player2.isAlive && (!player3.isAlive)){
				return whoIsAliveCode = 3;
			}
			if (player1.isAlive && (!player2.isAlive) && player3.isAlive){
				return whoIsAliveCode = 4;
			}
			
			// player2-based
			if (player2.isAlive && (!player1.isAlive) && (!player3.isAlive)){
				return whoIsAliveCode = 2;
			}
			
			if (player2.isAlive && (!player1.isAlive) && player3.isAlive){
				return whoIsAliveCode = 5;
			}
			
			// player3-based
			if (player3.isAlive && (!player1.isAlive) && (!player2.isAlive)){
				return whoIsAliveCode = 6;
			}
			
			// all alive
			if (player1.isAlive && player2.isAlive && player3.isAlive){
				return whoIsAliveCode = 7;
			}
					
		}
		function executeAI(playerNumber, firstEnemyChosen, enemyCountBy){
			// Executes repetitious AI but with passed in player number

			for (let i = firstEnemyChosen; i < enemies.length; i += enemyCountBy){
				
				switch(level){
						// Progressilvely add to AI complexity
					 case 1: moveAI = Math.floor(Math.random() * 1) + 1; break;
					 case 2: moveAI = Math.floor(Math.random() * 2) + 1; break;
					 case 3: moveAI = Math.floor(Math.random() * 3) + 1; break;
					 case 4: moveAI = Math.floor(Math.random() * 4) + 1; break;
					 case 5: moveAI = Math.floor(Math.random() * 5) + 1; break;
					 case 6: moveAI = Math.floor(Math.random() * 6) + 1; break;
					 case 7: moveAI = Math.floor(Math.random() * 7) + 1; break;
					 case 8: moveAI = Math.floor(Math.random() * 8) + 1; break;
					 case 9: moveAI = Math.floor(Math.random() * 9) + 1; break;
					 case 10: moveAI = Math.floor(Math.random() * 10) + 1; break;
					 case 11: moveAI = Math.floor(Math.random() * 11) + 1; break;
					 case 12: moveAI = Math.floor(Math.random() * 12) + 1; break;
					 case 13: moveAI = Math.floor(Math.random() * 13) + 1; break;
					 case 14: moveAI = Math.floor(Math.random() * 14) + 1; break;
					 default:
						moveAI = Math.floor(Math.random() * 15) + 1;
						break;
				}
	
						switch(moveAI){
							case 1:
							case 2:
							case 3:
								// don't move
							break;
							case 12: // Extra cases double the chance of enemy following player
							case 4: 
								if ((enemies[i].x <= playerNumber.snake[0].x) && (playerNumber.isAlive == true)){ 
									enemies[i].x += gameBoard.block;
								} 
								break;
							case 13:
							case 5: 
								if ((enemies[i].x >= playerNumber.snake[0].x) && (playerNumber.isAlive == true)){ 
								enemies[i].x -= gameBoard.block;
								} 
								break;
							case 14:
							case 6: 
								if ((enemies[i].y <= playerNumber.snake[0].y) && (playerNumber.isAlive == true)){ 
								enemies[i].y += gameBoard.block;
								} 
								break;
							case 15:
							case 7:
								if ((enemies[i].y >= playerNumber.snake[0].y) && (playerNumber.isAlive == true)){ 
								enemies[i].y -= gameBoard.block;
								} 
								break;
								
								// These cases cause enemies to wander a tiny bit
							case 8:
								enemies[i].x += gameBoard.block;
								break;
							case 9:
								enemies[i].x -= gameBoard.block;
								break;	
							case 10:
								enemies[i].y += gameBoard.block;
								break;
							case 11:
								enemies[i].y -= gameBoard.block;
								break;	
							
								default:
								break;
						}
				
			}

						

			
		}

		
	
	} 
	
	
	function projectileAI(){
		for (let i = 0; i < enemies.length; i ++){
			switch(enemies[i].type){
				
				case "MOB":
				break;
				
				case "FAT":
				break;
				
				case "SHOOTER":
					enemies[i].projectilePosition = [enemies[i].x, enemies[i].y];
					console.log(enemies[i].projectilePosition);
					
					// checkIfShot();
					
				break;
				
				default:
				break;
			}
		}
	}
	
	function checkForDamage(enemy, player){
			if ((enemy.x == player.snake[0].x) && (enemy.y == player.snake[0].y) && (player.isAlive == true)){
					player.lives -= 1;
					if (player.lives <=0){
						player.isAlive = false;
						
					}
					player.score -= 100;
					sndOuch.play();
					
					player.snake[0].x = 20; player.snake[0].y = 20; //20 is player start coordinates 20, 20
					cvs.fillStyle="red";
					cvs.fillRect(0,0,gameBoard.maxX, gameBoard.maxY);
		
			}
			
			
			
			
		}
	 
	function updateConsumableItems(player){
		cvs.drawImage(imgBADFILES, BADFILES.x, BADFILES.y); 
		cvs.drawImage(imgTROJANS, TROJANS.x, TROJANS.y); 
		cvs.drawImage(imgMEMORYLEAKS, MEMORYLEAKS.x, MEMORYLEAKS.y); 
		checkIfEaten(BADFILES);
		checkIfEaten(TROJANS);
		checkIfEaten(MEMORYLEAKS);
		
		
		function checkIfEaten(item){
			
			// Move items if enemy hits them + add difficulty
			for (let i=0; i < enemies.length; i++){
				if ((enemies[i].x == item.x) && (enemies[i].y == item.y)){
					item.x = (gameBoard.block * (Math.floor(Math.random() * 50) + 1));
					item.y = (gameBoard.block * (Math.floor(Math.random() * 50) + 1));
					
					sndEnemyPickup.play();
				}
			}
			
			// Check for trash Dropoff
			if ((player.snake[0].x >= trashCoords[0]) && 
				(player.snake[0].x <= (trashCoords[0] + 10)) && 
				(player.snake[0].y >= trashCoords[1]) && 
				(player.snake[0].y <= (trashCoords[1] + 10)) &&
				((player.BADFILES > 0) || player.TROJANS > 0 || player.MEMORYLEAKS > 0)
				){
					
					sndTrash.play();
					trashDropped += (parseInt(player.BADFILES) + parseInt(player.TROJANS) + parseInt(player.MEMORYLEAKS));
					player.BADFILES = 0;
					player.TROJANS = 0;
					player.MEMORYLEAKS = 0;
					
				}
			
			// Check to see if players ate the items
			if ((player.snake[0].x == item.x) && (player.snake[0].y == item.y)){
				switch (item){
					case BADFILES:
						player.score += BADFILESPoints;
						sndBADFILES.play();
						player.BADFILES += 1;
						if (enemies.length > 1 ){enemies.pop();}
						cvs.font = "36px Arial";
						cvs.fillStyle = player.color;
						cvs.fillText("+ " + BADFILESPoints, player.snake[0].x, player.snake[0].y);
					break;
					case TROJANS:
						player.score += TROJANSPoints;
						sndTROJANS.play();
						player.TROJANS += 1;
						if (enemies.length > 1 ){enemies.pop();}
						cvs.font = "36px Arial";
						cvs.fillStyle = player.color;
						cvs.fillText("+ " + TROJANSPoints, player.snake[0].x, player.snake[0].y);
					break;
					case MEMORYLEAKS:
						player.score += MEMORYLEAKSPoints;
						sndMEMORYLEAKS.play();
						player.MEMORYLEAKS += 1;
						if (enemies.length > 1 ){enemies.pop();}
						cvs.font = "36px Arial";
						cvs.fillStyle = player.color;
						cvs.fillText("+ " + MEMORYLEAKSPoints, player.snake[0].x, player.snake[0].y);
					break;
					default:
									
				}
				
					item.x = (gameBoard.block * (Math.floor(Math.random() * 50) + 1));
					item.y = (gameBoard.block * (Math.floor(Math.random() * 50) + 1));
					
					player.skipPop = true;
			}
		}
		

	}
	

	

	function gameOver(){
		//clearInterval(gameLoop);
		sndTitle.pause();
		sndGameOver.play();
		sndGameOver.loop = true;
		
		cvs.fillStyle = "#ff3300";
		cvs.font = "30px Arial";
		cvs.fillText("GAME OVER!", 10, 620);
		
		cvs.fillStyle = "white";
		cvs.font = "15px Arial";
		cvs.fillText(player1.name + " scored: " + parseInt(player1.score), 10, 650);
		cvs.fillText(player2.name + " scored: " + parseInt(player2.score), 10, 670);
		cvs.fillText(player3.name + " scored: " + parseInt(player3.score), 10, 690);
		
		cvs.fillStyle = "#ffff00";
		cvs.font = "15px Arial";
		cvs.fillText("Team Score: " + parseInt(player3.score + player2.score + player1.score), 10, 710);
		
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
		
		cvs.fillStyle = "orange";
		cvs.font = "10px Arial";
		cvs.fillText("Highest Score: " + highScore, 10, 730);
		cvs.fillText("By: " + localStorage.getItem("By"), 10, 750);			
		cvs.fillText("Highest Team Score: " + localStorage.getItem("Highest Team Score"), 100, 750);	
		
		
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
						setupGame();
						direction();
						break;
					
					case 50:
						// 2 players chosen
						player3.isAlive = false;
						numPlayers = 2;
						setupGame();
						direction();
					break;
					
					case 51:
						// 3 players chosen
						numPlayers = 3;
						setupGame();
						direction();
					break;
				}
				
				
			});
			          
                           

	} 