const FLOOR_HEIGHT = 48
const speed = 620

kaboom({
	fullscreen: true,
	scale: 2,
	startScene: "main",
	version: "0.5.0",
	clearColor: [0, 0, 0, 1],
	global: true,
});

let isJumping = true

loadSprite("bg", "testesprites/BG.png");

loadSprite("ground-l", "testesprites/ground-l.png");
loadSprite("ground-r", "testesprites/ground-r.png");
loadSprite("ground", "testesprites/ground.png");
loadSprite("crate", "testesprites/Crate.png");
loadSprite("pc", "testesprites/pc.png");
loadSprite("heart", "testesprites/hearts_hud.png");
loadSprite("grass", "testesprites/grass_props.png");

loadSprite("coin", "testesprites/coin_anim_strip_6.png", {
	sliceX: 6,
	sliceY: 1,
	anims: {
		idle: { from: 0, to: 5 },
	},
});
loadSprite("dino", "testesprites/sandro.png", {
	sliceX: 0,
	sliceY: 2,
	anims: {
		idle: { from: 0, to: 2 },
		run: { from: 0, to: 2 },
	},
});

scene("game", ({ level }) => {
	gravity(980);
	layers(["bg", "obj", "ui"], "obj");
	camIgnore(["ui", "bg"]);

	add([sprite("bg"), scale(width() / 1000, height() / 750), layer("bg")]);

	const maps = [
		[
			"                                      	                            	         ",
			"                                      	                            	         ",
			"                                                                   	         ",
			"           $   $              $          	                        	         ",
			"         =    =       $     =   =     $ 	              	  	    	         ",
			"       =          $   =  =        =    	=	=    =               	         ",
			"             %  %     = %% %%%         %           <-->            	         ",
			"<-->  <----------------------->      <---->                        	         ",
			"                                                         <---->          	     ",
			"                                                                    	         ",
			"                                                                        <---->  ",
			"                                                                   	         ",
			"                                                                  	       <->   ",
			"                                                                   	         ",
			"                                                                   	         ",
			
		]
	];

	const levelConfig = {
		width: 32,
		height: 32,
		pos: vec2(0, height() - 78),
		"<": [sprite("ground-l"), "block", solid()],
		"-": [sprite("ground"), solid()],
		">": [sprite("ground-r"), "block", solid()],
		"%": [sprite("pc"), "pc", solid()],
		"=": [sprite("crate"), "crate", "block", solid()],
		"$": [sprite("coin"), "coin"],
	};

	const map = addLevel(maps[level], levelConfig);

	function small() {
		let timer = 0
		let isSmall= false
		return {
		  update() {
			if (isSmall) {
			  timer -=dt()
			  if (timer <=0) {
				this.normalify()
			  }
			}
		  },
		  isBig() {
			return isSmall
		  },
		  smallify(time) {
			this.scale = 0.8
			timer = time
			isSmall = true
		  },
		  normalify() {
			this.scale = 1.4
			timer = 0
			isSmall = false
		  },
		}
	  }

	const player = add([
		sprite("dino", {
			animSpeed: 0.1,
		}),
		scale(1.4),
		small(),
		pos(map.getPos(2, -4)),
		body(),
		origin("center"),
		{
			speed: 160,
			jumpForce: 340,
			heart: 5,
		},
	]);

	const coin = add([
		sprite("coin", {
			animSpeed: 0.1,
		}),
		scale(1),
		solid(),
		"coin",
	]); 

	const score = add([
		text(`score: ${0}`, 18),
		color(rgb(0, 0, 0)),
		layer("ui"),
		pos(width() - 86, 24),
		origin("center"),
		{ value: 0 },
	]);

	add([sprite("heart"),scale(2), layer("ui"), pos(12, 12)])
	const heart = add([
		text(player.heart, 16),
		color(rgb(0, 0, 0)),
		layer("ui"),
		pos(56, 30),
		origin("center"),
	]);

	player.play("idle");
	coin.play("idle");

	function respawn() {
		score.value = 0;
		player.heart = 5;
		player.pos = vec2(0, 0);
	}

	keyDown(["left", "right"], () => {
		if (player.grounded() && player.curAnim() !== "run") {
			player.play("run");
		}
	});

	keyRelease(["left", "right"], () => {
		if (!keyIsDown("right") && !keyIsDown("left")) {
			player.play("idle");
		}
	});

	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(player.jumpForce);
			isJumping = true
		}
	});

	keyDown("left", () => {
		player.flipX(-1);
		player.move(-player.speed, 0);
	});

	keyDown("right", () => {
		player.flipX(1);
		player.move(player.speed, 0);
	});

	keyDown("shift", () => {
		player.smallify(3)
	});

	player.action(() => {
		camPos(player.pos);
		heart.text = player.heart
	});

	player.action(() => {
		if (player.pos.y >= 800 || player.heart <= 0) {
			go("lose")
		}
	});

	player.collides("coin", (b) => {
		destroy(b);
		score.value += 10;
		score.text = `score: ${score.value}`;
	});

	player.collides("pc", () => {
		camShake(8);
		player.heart--;
	});

});

scene("lose", () => {

	add([
		text("Game Over - CTRL+R to Play Again"),
		pos(width() - 300, 160),
		origin("center"),
	])



})

start("game", { level: 0 });
