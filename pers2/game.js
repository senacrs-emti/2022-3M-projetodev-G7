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
loadSprite("portal", "testesprites/pirtol.png", {
});

loadSprite("teste", "testesprites/teste.png", {
	sliceX: 1,
	anims: {
		"idle": { from: 0, to: 1, speed: 5, loop: true }
	}		
})

loadSprite("heart", "testesprites/hearts_hud.png");

loadSprite("cafe", "testesprites/cafe.png", {
	sliceX: 1,
	anims: {
		idle: { from: 3, to: 0 },
		speed: 4,
		loop: true,
	},
	
});
loadSprite("will", "testesprites/will.png", {
	sliceX: 2,
	sliceY: 0,
	anims: {
		idle: { from: 0, to: 0 },
		run: { from: 0, to: 1, loop: true },
	},
});

scene("game", ({ level }) => {
	gravity(960);
	layers(["bg", "obj", "ui"], "obj");
	camIgnore(["ui", "bg"]);

	add([sprite("bg"), scale(width() / 1600, height() / 900), layer("bg")]);

	const maps = [
		[
			"%$=$%   ]]] =%        =  $                                                       ",
			"<------------>  =     =  $                                                       ",
			"                   = =    =        $   =  $                                      ",
			"                   %%%%%  %   $==  ==      =                                     ",
			"                   <------>   =$%% %=        $                        $$         ",
			"                             <------>         =           $         =   = $      ",
			"                                                       =   =     $=%%%     =     ",
			"                                                 %  =%          <---->           ",
			"                                                 <---->                          ",
			"                                                                                 ",
			"                                                                            $ %% ",
			"                                                                             <-> ",
			"                                                                                 ",
			"                                                                         #       ",
			"                                                                                 ",
			"                                                                                 ",
			"                                                                                 ",
			"                                                                                 ",
		
		]
	];

	const levelConfig = {
		width: 32,
		height: 32,
		pos: vec2(0, height() - 78),
		"<": [sprite("ground-l"), "block", solid()],
		"-": [sprite("ground"), solid()],
		">": [sprite("ground-r"), "block", solid()],
		"%": [sprite("teste"), "teste", solid(), scale(1)],
		"=": [sprite("crate"), "crate", "block", solid()],
		"$": [sprite("cafe"), "cafe", scale(0.7)],
		"#": [sprite("portal"), "portal", solid(), scale(0.45)],
	};

	const map = addLevel(maps[level], levelConfig);

	const player = add([
		sprite("will", {
			animSpeed: 0.1,
		}),
		scale(1.0),
		pos(map.getPos(2, -4)),
		body(),
		origin("center"),
		{
			speed: 125,
			jumpForce: 360,
			heart: 5,
		},
	]);

	const teste = add([
		sprite("teste", {
			animSpeed: 1,
		}),
		solid(),
		"teste",
	]); 


	const cafe = add([
		sprite("cafe", {
			animSpeed: 0.1,
		}),
		scale(0.1),
		solid(),
		"cafe",
	]); 

	const score = add([
		text(`CAFEZES: ${0}`, 14),
		color(rgb(250, 249, 247)),
		layer("ui"),
		pos(width() - 86, 24),
		origin("center"),
		{ value: 0 },
	]);

	add([
		text("Bem-vindo ao Senac Run!"),
		pos(width() - 400, 180),
		origin("center"),
	])

	add([
		text("Pule !"),
		pos(width() - -950, 300),
		origin("center"),
	])

	add([sprite("heart"),scale(2), layer("ui"), pos(12, 12)])
	const heart = add([
		text(player.heart, 16),
		color(rgb(250, 249, 247)),
		layer("ui"),
		pos(56, 30),
		origin("center"),
	]);

	player.play("idle");
	cafe.play("idle");
	teste.play("idle");

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

	player.action(() => {
		camPos(player.pos);
		heart.text = player.heart
	});

	player.action(() => {
		if (player.pos.y >= 800 || player.heart <= 0) {
			go("lose")
		}
	});


	player.collides("cafe", (b) => {
		destroy(b);
		score.value += 1;
		score.text = `CAFEZES: ${score.value}`;
	});

	player.collides("teste", () => {
		camShake(8);
		player.heart--;
	});

	player.collides("portal", () => {
		camShake(8);
		go("win", {score: score});
	});

	scene("win", ({score}) => {

		add([
			text(`Voce venceu! Ganhou esse tantao de ${score.value} cafezes - CTRL+R para Jogar de Novo!`),
			pos(width() - 300, 160),
			origin("center"),
		])
		
	})

});

scene("lose", () => {
	
	add([
		text("Game Over - CTRL+R para Jogar de Novo!"),
		pos(width() - 300, 160),
		origin("center"),
	])

})

start("game", { level: 0 });
