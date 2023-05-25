const canvas = document.getElementById("gameCanvas");
canvas.width = 900;
canvas.height = 450;
const ctx = canvas.getContext("2d");
const killer = document.getElementById("killer");
const bulletImg = document.getElementById("bullet");
const bug = document.getElementById("bug");
const deathImg = document.getElementById("space");
const gameOverImg = document.getElementById("gameOverImg");
let gameOverCheck = false;
let requestId;
let bugSpeed = 0.5;
let bullets = [];
let deathArr = [];
let bugLevelOne = [];

const player = {
	w: 55,
	h: 35,
	x: 425,
	y: 415,
	speed: 5,
	dx: 0, 
	dy: 0
};

function Bug(x, y) {
	this.w = 40;
	this.h = 40;
	this.x = x;
	this.y = y;
	this.speed = bugSpeed;
}

function Bullet(x) {
	this.w = 15;
	this.h = 15;
	this.x = x;
	this.y = 414;
	this.speed = 7;
}

function Death(x, y) {
	this.w = 50;
	this.h = 50;
	this.x = x;
	this.y = y;
	this.speed = 3;
}

function createDeath(x, y) {
	deathArr.push(new Death(x, y));
}

function createBullet() {
	bullets.push(new Bullet(player.x));
	bullets.push(new Bullet(player.x + (player.w - 15)));
}

function createBugLevelOne() {
	bugLevelOne[0] = new Bug(50, 0);
	bugLevelOne[1] = new Bug(bugLevelOne[0].x + bugLevelOne[0].w + 10, 0);
	bugLevelOne[2] = new Bug(bugLevelOne[1].x + bugLevelOne[1].w + 10, 0);
	bugLevelOne[3] = new Bug(bugLevelOne[2].x + bugLevelOne[2].w + 10, 0);
	bugLevelOne[4] = new Bug(bugLevelOne[3].x + bugLevelOne[3].w + 10, 0);

	bugLevelOne[5] = new Bug(bugLevelOne[1].x, bugLevelOne[1].h + 10);
	bugLevelOne[6] = new Bug(bugLevelOne[2].x, bugLevelOne[2].h + 10);
	bugLevelOne[7] = new Bug(bugLevelOne[3].x, bugLevelOne[3].h + 10);

	bugLevelOne[8] = new Bug(bugLevelOne[6].x, bugLevelOne[6].h + bugLevelOne[6].y + 10);


	bugLevelOne[9] = new Bug(500, 0);
	bugLevelOne[10] = new Bug(bugLevelOne[9].x + bugLevelOne[9].w + 10, 0);
	bugLevelOne[11] = new Bug(bugLevelOne[10].x + bugLevelOne[10].w + 10, 0);
	bugLevelOne[12] = new Bug(bugLevelOne[11].x + bugLevelOne[11].w + 10, 0);
	bugLevelOne[13] = new Bug(bugLevelOne[12].x + bugLevelOne[12].w + 10, 0);

	bugLevelOne[14] = new Bug(bugLevelOne[10].x, bugLevelOne[10].h + 10);
	bugLevelOne[15] = new Bug(bugLevelOne[11].x, bugLevelOne[11].h + 10);
	bugLevelOne[16] = new Bug(bugLevelOne[12].x, bugLevelOne[12].h + 10);

	bugLevelOne[17] = new Bug(bugLevelOne[15].x, bugLevelOne[15].h + bugLevelOne[15].y + 10);

}

function checkForKill() {
	let i;
	let j;
	let bulletX;
	let bulletY;
	
	for (i = 0; i < bugLevelOne.length; i++) {
		if (bugLevelOne[i].y + bugLevelOne[i].h >= 450) {
			gameOverCheck = true;
			break;
			} else {
				for (j = 0; j < bullets.length; j++) {
					bulletX = bullets[j].x;
					bulletY = bullets[j].y;

					if (bugLevelOne[i] === undefined) {
						
						if (bugLevelOne.length >= i) {
							i--;
						}
						if (i < 0) {
							break;
						}
					}

					if (bulletX > bugLevelOne[i].x && bulletX < bugLevelOne[i].x + bugLevelOne[i].w && bulletY < bugLevelOne[i].y) {
						createDeath(bulletX, bulletY);
						bullets.splice(j, 1);
						bugLevelOne.splice(i, 1);
					}
				}
			}
	}
}

function gameOver() {
	ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
}

function pauseGame() {
	cancelAnimationFrame(requestId);
}
	

function startGame() {
	bugSpeed = 0.5;
	createBugLevelOne();
	gameOverCheck = false;
	update();
}

function update() {
	if (gameOverCheck === true) {
		gameOver();
	} else {
		checkForKill();
		newPos();
		clear();
		drawPlayer();
		drawBug();
		drawBullet();
		drawDeath();
	}
	
	requestId = requestAnimationFrame(update);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBug() {
	let i;
	for (i = 0; i < bugLevelOne.length; i++) {
		ctx.drawImage(bug, bugLevelOne[i].x, bugLevelOne[i].y, bugLevelOne[i].w, bugLevelOne[i].h);
		bugLevelOne[i].y += bugLevelOne[i].speed;
	}
}

function drawBullet() {
	let i;
	for (i = 0; i < bullets.length; i++) {
		if (bullets[i].y > 0) {
			ctx.drawImage(bulletImg, bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
			bullets[i].y -= bullets[i].speed;
		} else {
			bullets.splice(i, 1);
		}
	}
}

function drawPlayer() {
	ctx.drawImage(killer, player.x, player.y, player.w, player.h);
};

function drawDeath() {
	let i;
	for (i = 0; i < deathArr.length; i++) {
		ctx.drawImage(deathImg, deathArr[i].x, deathArr[i].y, deathArr[i].w, deathArr[i].h);
		deathArr[i].y += deathArr[i].speed;
	}
}

function newPos () {
	player.x += player.dx;

	detectWalls();
}

function detectWalls() {
	if (player.x < 0) {
		player.x = 0;
	}

	if (player.x + player.w > canvas.width) {
		player.x = canvas.width - player.w;
	}
}

document.addEventListener("keydown", keyDown);

function keyDown(e) {
	if (e.key === "ArrowRight" || e.key === "Right") {
		moveRight();
	} else if (e.key === "ArrowLeft" || e.key === "Left") {
		moveLeft();
	} else if (e.key === "ArrowUp" || e.key === "Up") {
		createBullet();
	}
}

document.addEventListener("keyup", keyUp);

function keyUp(e) {
	if (
		e.key === "ArrowRight" || e.key === "Right" ||
		e.key === "ArrowLeft" || e.key === "Left" ||
		e.key === "ArrowUp" || e.key === "Up"
		) {
		player.dx = 0;
		player.dy = 0;
	}
} 

function moveRight() {
	player.dx = player.speed;
}

function moveLeft() {
	player.dx = -player.speed;
}
