// **********************
// * Author: Nick Myers *
// * Title:  Snake      *
// * Date:   10/27/2014 *
// **********************

function Game() {
	this.options = {
		frameTime: 80,
		cellSize: 20,
		startSize: 8,
		snakeColor: "lightblue",
		foodColor: "orange"
	};

	this.c = document.getElementById("canvas");
	this.ctx = this.c.getContext("2d");
	this.widthPx = this.c.getAttribute("width");
	this.heightPx = this.c.getAttribute("height");
	this.width = this.widthPx / this.options.cellSize;
	this.height = this.heightPx / this.options.cellSize;
	this.direction = "right";
}
Game.prototype.drawSnake = function(snake) {
	for(var i = 0; i < snake.cells.length; i++) {
			var cell = snake.cells[i];
			this.drawSquare(cell);
	}
}
Game.prototype.updateSnake = function(snake) {
	var dir = this.direction;
	var head = snake.cells[0];
	var tail = snake.cells.pop();

	if(dir == "left") {
		tail.x = head.x - 1;
		tail.y = head.y;
	}
	if(dir == "right") {
		tail.x = head.x + 1; 
		tail.y = head.y;
	}
	if(dir == "up") {
		tail.x = head.x;
		tail.y = head.y - 1; 
	}
	if(dir == "down") {
		tail.x = head.x;
		tail.y = head.y + 1;
	}

	snake.cells.unshift(tail);
}
Game.prototype.drawSquare = function(square) {
	var size = this.options.cellSize;

	this.ctx.fillStyle = square.color;
	this.ctx.fillRect(
			square.x * size,
			square.y * size, 
			size,
			size
	);
	this.ctx.strokeRect(
			square.x * size,
			square.y * size, 
			size,
			size
	);
}
Game.prototype.clearScreen = function() {
	this.ctx.clearRect(0, 0, this.widthPx, this.heightPx);
}
Game.prototype.noCollide = function(snake) {
	var head = snake.cells[0];

	if(head.x > this.width - 1) return false;
	if(head.x < 0) return false;
	if(head.y < 0) return false;
	if(head.y > this.height - 1) return false;

	for(var i = 1; i < snake.cells.length; i++) {
		var cell = snake.cells[i];
		if(head.x == cell.x && head.y == cell.y)
			return false;
	}

	return true;
}
Game.prototype.randNum = function(multiple) {
	var number = Math.floor(Math.random() * multiple);
	return number;
}
Game.prototype.eatsFood = function(snake, food) {
	var head = snake.cells[0];
	
	if(head.x == food.x && head.y == food.y)
		return true;

	return false;
}
Game.prototype.growSnake = function(snake, food) {
	var head = new Square(food.x, food.y, this.options.snakeColor);
	snake.cells.unshift(head);
}

function Snake(startSize, color) {
	var cells = [];
	for(var i = startSize - 1; i >= 0; i--) {
		var square = new Square(i, 0, color);
		cells.push(square);
	}
	this.cells = cells;
}

function Square(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
}

function main() {
	var game = new Game();
	var snake = new Snake(game.options.startSize, game.options.snakeColor);
	var food = new Square(game.randNum(game.width), game.randNum(game.height), game.options.foodColor);
	game.running = true;

	var loop = setInterval(function() {
		if(game.running) {
			game.clearScreen();	

			game.drawSnake(snake);
			game.drawSquare(food);

			if(game.eatsFood(snake, food)) {
				game.growSnake(snake, food);
				food.x = game.randNum(game.width);
				food.y = game.randNum(game.height);
			}
			
			game.updateSnake(snake);

			if(!game.noCollide(snake)) {
				game.running = false;
			}

		} else {
			clearInterval(loop);
			main();
		}
	}, game.options.frameTime);

	$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
					if(game.direction != "right")
						game.direction = "left";
        break;
        case 38: // up
					if(game.direction != "down")
						game.direction = "up";
        break;
        case 39: // right
					if(game.direction != "left")
						game.direction = "right";
        break;
        case 40: // down
					if(game.direction != "up")
	  				game.direction = "down";
   		  break;
        default: return;    
		}
    e.preventDefault();
	});
}
