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
loadSprite("portal", "testesprites/portal.png", {
	sliceX: 4,
});

loadSprite("pc", "testesprites/pc.png", {
	sliceX: 5,
	anims: {
		"idle": { from: 0, to: 5, speed: 5, loop: true }
	}		
})

loadSprite("heart", "testesprites/hearts_hud.png");

loadSprite("frango", "testesprites/frango.png", {
	sliceX: 1,
	anims: {
		idle: { from: 3, to: 0 },
		speed: 4,
		loop: true,
	},
	
});
loadSprite("dondos", "testesprites/dondos.png", {
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
			"             $  <--->                       =  <->  $                            ",
			"             =             $%               $       = %                          ",
			"             $           <-=->              =         = $                        ",
			"             =                   % $        $           = %                      ",
			"         $                      <-=->       =             = $                    ",
			"         = $                           $% $%                =                    ",
			"           = $                         <-=->                                     ",
			"             =                                                   % $             ",
			"                                                               <-=->             ",
			"               =                                                                 ",
			"            $=                                                        =          ",
			"           =                                                                     ",
			"   $   $ =                                                                       ",
			" <->  <->                                                              <--=--=-> ",
			"                                                                   #             ",
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
		"%": [sprite("pc"), "pc", solid()],
		"=": [sprite("crate"), "crate", "block", solid()],
		"$": [sprite("frango"), "frango", scale(0.7)],
		"#": [sprite("portal"), "portal", solid(), scale(0.25)],
	};

	const map = addLevel(maps[level], levelConfig);

	const player = add([
		sprite("dondos", {
			animSpeed: 0.1,
		}),
		scale(1.0),
		pos(map.getPos(2, -4)),
		body(),
		origin("center"),
		{
			speed: 145,
			jumpForce: 360,
			heart: 4,
		},
	]);

	const pc = add([
		sprite("pc", {
			animSpeed: 1,
		}),
		solid(),
		"pc",
	]); 


	const frango = add([
		sprite("frango", {
			animSpeed: 0.1,
		}),
		scale(0.1),
		solid(),
		"frango",
	]); 


	const score = add([
		text(`FRANGOZAS: ${0}`, 14),
		color(rgb(0, 0, 0)),
		layer("ui"),
		pos(width() - 86, 24),
		origin("center"),
		{ value: 0 },
	]);

	add([
		text("Bem-vindo ao Senac Run!"),
		pos(width() - 380, 290 ),
		color(rgb(0, 0, 0)),
		origin("center"),
	])

	add([
		text("Pule! >"),
		pos(width() - 120, 150 ),
		color(rgb(0, 0, 0)),
 		origin("center"),
	])


	add([sprite("heart"),scale(2), layer("ui"), pos(12, 12)])
	const heart = add([
		text(player.heart, 16),
		color(rgb(0, 0, 0)),
		layer("ui"),
		pos(56, 30),
		origin("center"),
	]);

	player.play("idle");
	frango.play("idle");
	pc.play("idle");

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


	player.collides("frango", (b) => {
		destroy(b);
		score.value += 1;
		score.text = `FRANGOZAS: ${score.value}`;
	});

	player.collides("pc", () => {
		camShake(8);
		player.heart--;
	});

	player.collides("portal", () => {
		camShake(8);
		go("win", {score: score});
	});

	scene("win", ({score}) => {

		add([
			text(`Voce conseguiu! Venceu e pode degustar esse tanto ${score.value} de franguinhos
			
			  CTRL+R para Jogar de Novo!`),
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
