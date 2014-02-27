/* Foodship Nine (aka Sky Warrior)
* NOTE: try to only use percentages for everything, in order to allow the game to scale to any resolution
*/
var SW = function(game_div) {
	var self = this;
	this.scriptFileName = "sw.js";

	this.collisionGrid;
	this.currentPlayerEnemyCollisions;
	this.currentWeaponPointer;
	this.friendlyWeaponHits;

	this.gameWindow = "#sw-game";
	this.combatWindow = "#sw-game-combat";
	this.hudWindow = "#sw-game-hud";

	this.defautTimeUnit = 20; // check stuff like user input every 20ms
	this.minScreenWidth = 640;
	this.minScreenHeight = 640;
	this.minHudHeight = 64;
	this.minHudWidth = 640;

	this.screenWidth = self.minScreenWidth;
	this.screenHeight = self.minScreenHeight;
	this.hudHeight = self.minHudHeight;
	this.hudWidth = self.minHudWidth;

	// trig is t3h l33t
	this.deg2rad = Math.PI / 180;
	this.rad2deg = 180 / Math.PI;
	//var ratio = Math.tan(degs * self.deg2rad);
	//var degrees = Math.atan(rads) * self.rad2deg;

	this.inputUp = [38, 87]; // default - UP ARROW or W
	this.inputDown = [40, 83]; // default - UP ARROW or S
	this.inputLeft = [37, 65]; // default - UP ARROW or A
	this.inputRight = [39, 68]; // default - UP ARROW or D
	this.inputFire = [32]; // default - SPACEBAR
	this.inputSpecial = [16]; // default - SHIFT

	this.activeInputs = {
		'up' : false,
		'down' : false,
		'left' : false,
		'right' : false,
		'fire' : false,
		'special' : false
	};
	this.allowPlayerInput = true;

	this.currentMousePos = {x:0, y:0};
	this.playerID = "sw-playa";
	this.playerDiv = "#sw-playa";
	this.playerDefaultSpeed = 3.2;
	this.playerSpeed = 3.2;
	this.maxPlayerTeleportDistance = 320;

	this.hudHPBarID = "sw-hud-hp";
	this.hudSpecialBarID = "sw-hud-special";

	this.hudCtrlPrefix = "sw-hud-ctrl-";
	this.hudCtrlUpID = self.hudCtrlPrefix + "up";
	this.hudCtrlDownID = self.hudCtrlPrefix + "down";
	this.hudCtrlLeftID = self.hudCtrlPrefix + "left";
	this.hudCtrlRightID = self.hudCtrlPrefix + "right";
	this.hudCtrlUpLeftID = self.hudCtrlPrefix + "up-left";
	this.hudCtrlUpRightID = self.hudCtrlPrefix + "up-right";
	this.hudCtrlDownLeftID = self.hudCtrlPrefix + "down-left";
	this.hudCtrlDownRightID = self.hudCtrlPrefix + "down-right";
	this.hudCtrlFireID = self.hudCtrlPrefix + "fire";
	this.hudCtrlSpecialID = self.hudCtrlPrefix + "special";

	this.hudHPBarDiv = "#sw-hud-hp";
	this.hudSpecialBarDiv = "#sw-hud-special";
	this.hudCtrlUpDiv = "#" + self.hudCtrlPrefix + "up";
	this.hudCtrlDownDiv = "#" + self.hudCtrlPrefix + "down";
	this.hudCtrlLeftDiv = "#" + self.hudCtrlPrefix + "left";
	this.hudCtrlRightDiv = "#" + self.hudCtrlPrefix + "right";
	this.hudCtrlUpLeftDiv = "#" + self.hudCtrlPrefix + "up-left";
	this.hudCtrlUpRightDiv = "#" + self.hudCtrlPrefix + "up-right";
	this.hudCtrlDownLeftDiv = "#" + self.hudCtrlPrefix + "down-left";
	this.hudCtrlDownRightDiv = "#" + self.hudCtrlPrefix + "down-right";
	this.hudCtrlFireDiv = "#" + self.hudCtrlPrefix + "fire";
	this.hudCtrlSpecialDiv = "#" + self.hudCtrlPrefix + "special";

	this.hpCurrent = 100;
	this.hpTotal = 100;

	this.primaryGunCurrentTimer = -1;
	this.primaryGunRefire= 500;
	this.currentPrimaryGun = '';

	this.laserCurrentTimer = -1;
	this.laserRefire= 1000;

	this.specialCurrentTimer = -1;
    // this.specialCooldown = 10000;
    this.specialCooldown = 1000;
    this.specialDamage = 500;

	this.zIndexPlayer = 100;
	this.zIndexEnemy = 200;

	this.gfx = {};
	this.sprites = {};
	this.music = {};
	this.sfx = {};
	this.primaryGuns = {};

	this.sfxVolume = 0.5;
	this.musicVolume = 0.5;

	this.projectileIntervals = {};





	this.init = function(game_div) {
		self.setGamePath();
        game_div = self.parseUndefined(game_div, self.gameWindow);

        self.gameWindow = game_div;
        // self.gameWindow = "#sw-game";
	    self.combatWindow = self.gameWindow + "-combat";
	    self.hudWindow = self.gameWindow + "-hud";

		$(self.gameWindow).attr('tabindex', 0);
		$(self.gameWindow).css('overflow', 'hidden');

        $(self.gameWindow).css('width', self.minScreenWidth + "px");
        $(self.gameWindow).css('height', (self.minScreenHeight + self.hudHeight) + "px");
        // self.screenWidth = parseInt($(self.gameWindow).css('width'));
        // self.screenHeight = parseInt($(self.gameWindow).css('height'));

		if(self.screenWidth < self.minScreenWidth) {
			self.screenWidth = self.minScreenWidth;
		}
		if(self.screenHeight < self.minScreenHeight) {
			self.screenHeight = self.minScreenHeight;
		}
		if(self.hudWidth < self.minHudWidth) {
			self.hudWidth = self.minHudWidth;
		}
		if(self.hudHeight < self.minHudHeight) {
			self.hudHeight = self.minHudHeight;
		}

		$(self.gameWindow).append("<div id='" + self.combatWindow.replace('#', '') + "' style='position:relative;overflow:hidden;'></div>");
		$(self.gameWindow).append("<div id='" + self.hudWindow.replace('#', '') + "' style='position:relative;overflow:hidden;'></div>");
		$(self.hudWindow).css('width', self.hudWidth + "px");
		$(self.hudWindow).css('height', self.hudHeight + "px");
		$(self.combatWindow).css('width', self.screenWidth + "px");
		$(self.combatWindow).css('height', self.screenHeight + "px");

		// this 'speed' is 0.5% of the average of the screen height and width, every 20 milliseconds
        self.playerDefaultSpeed = (self.screenWidth + self.screenHeight) * 0.0025;
        // self.playerDefaultSpeed = 0.005;
		self.playerSpeed = self.playerDefaultSpeed;

		$(self.combatWindow).css('background', 'rgb(0,0,0)');
        self.drawHUD("rgba(64,64,64, 1.0)", "rgba(255,0,0, 0.7)", "rgba(128,128,255, 0.7)", "rgba(0,255,0, 1.0)", "rgba(0,0,0, 1.0)");
		self.maxPlayerTeleportDistance = (self.screenWidth + self.screenHeight) * 0.25;



		self.gfx = {};

		self.sprites = {
			'player': [
				self.loadImage("gfx/supercarrot-left.gif"),
				self.loadImage("gfx/supercarrot-mid.gif"),
				self.loadImage("gfx/supercarrot-right.gif")
			],
			'gun1': [
				self.loadImage("gfx/primary-gun-1a.png"),
				self.loadImage("gfx/primary-gun-1b.png"),
				self.loadImage("gfx/primary-gun-1c.png")
			],
			'mook1': [
				self.loadImage("gfx/mook1.png"),
			]
		};

		// multiple extensions - mp3/ogg
		self.music = {
			// 'dawn': [self.loadSound("mus/03 Anamanaguchi - Dawn Metropolis")],
		};

		self.sfx = {
			'gun1': [
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1"),
				self.loadSound("sfx/primary-gun1")
			],
			'special': [self.loadSound("sfx/special")],
			'special-nova': [self.loadSound("sfx/special-nova")]
		};

		self.primaryGuns = {
			'gun1': {
				0: {
                    // 'angle': 90, // rad = Math.tan(angle * self.deg2rad)
                    'angle': null,
					'count': 0,
					'damage': 10,
					'duration': -1, // -1 will only despawn the projectile if it goes off screen
					'limit': 10,
					'sprite': self.sprites['gun1'][0],
					'style': "",
					'time_interval': 20, //how often to update the projectile's position
					'velocity': 0.02,
					'velocity_x': 0, // percentage of screen width (between 0 and 1) covered every time interval
					'velocity_y': 0.02 // percentage of screen height (between 0 and 1) covered every time interval
				},
				1: {
				    'angle': null,
					'count': 0,
					'damage': 5,
					'duration': -1,
					'limit': 10,
					'sprite': self.sprites['gun1'][1],
					'style': "",
					'time_interval': 20,
					'velocity': 0.02,
					'velocity_x': -0.003125,
					'velocity_y': 0.016875
				},
				2: {
				    'angle': null,
					'count': 0,
					'damage': 5,
					'duration': -1,
					'limit': 10,
					'sprite': self.sprites['gun1'][2],
					'style': "",
					'time_interval': 20,
					'velocity': 0.02,
					'velocity_x': 0.003125,
					'velocity_y': 0.016875
				}
			}
		};
		self.currentPrimaryGun = 'gun1';



		var progress;
		var load_assets = setInterval(function() {
			progress_sprite = self.checkLoadProgress(self.sprites);
			progress_music = self.checkLoadProgress(self.music);
			progress_sfx = self.checkLoadProgress(self.sfx);

			if(progress_sprite >= 1
				&& progress_music >= 1
				&& progress_sfx >= 1) {

				clearInterval(load_assets);

				$(document).mousemove(function(e) {
					self.currentMousePos.x = e.pageX - $(self.combatWindow).offset().left;
					self.currentMousePos.y = e.pageY - $(self.combatWindow).offset().top;
				});

				self.drawSprite(
					self.playerID,
					'player',
					self.sprites['player'][1],
					self.screenWidth * 0.5,
					self.screenHeight,
					self.screenWidth * 0.05,
					self.screenHeight * 0.05,
					self.zIndexPlayer);
                self.collisionGrid = new QuadTree(self.screenWidth, self.screenHeight);
				self.collisionGrid.addCollisionData(self.playerDiv, "player", self.collisionGrid.grid);

				self.initPlayerControls();
				setInterval(self.processInputsAndCollisions, self.defautTimeUnit);
				$(self.gameWindow).focus();



                // tests
				// self.createLineXY("tl1", 8, 10, 10, 100, 100);
				// self.createLineXY("tl2", 8, 80, 30, 200, 10);
				// self.createLine("tl3", 8, 50, 200, 100, -40);
				$("#sw-hud-special").click(function() {
					// self.playMusic(self.music['dawn'], 0.5);
				});
				$("#sw-hud-hp").click(function() {
					// self.pauseAudio(self.music['dawn'], 0);
				});

				/*
				self.drawSprite(
					"mook1",
					'enemy',
					self.sprites['mook1'][0],
					self.screenWidth * 0.2,
					self.screenHeight * 0.2,
					self.screenWidth * 0.03125,
					self.screenHeight * 0.05,
					self.zIndexEnemy);
				self.drawSprite(
					"mook2",
					'enemy',
					self.sprites['mook1'][0],
					self.screenWidth * 0.5,
					self.screenHeight * 0.1,
					self.screenWidth * 0.03125,
					self.screenHeight * 0.05,
					self.zIndexEnemy);
				self.drawSprite(
					"mook3",
					'enemy',
					self.sprites['mook1'][0],
					self.screenWidth * 0.7,
					self.screenHeight * 0.3,
					self.screenWidth * 0.03125,
					self.screenHeight * 0.05,
					self.zIndexEnemy);
				*/
				// self.collisionGrid.addCollisionData("#mook1", "enemy", self.collisionGrid.grid);
				// self.collisionGrid.addCollisionData("#mook2", "enemy", self.collisionGrid.grid);
				// self.collisionGrid.addCollisionData("#mook3", "enemy", self.collisionGrid.grid);

			}
			else {
				console.log(progress_sprite);
				// console.log(progress_music);
				console.log(progress_sfx);
			}
		}, 1000);
	};



	this.resetPlayerControls = function() {
		self.inputUp = [38, 87]; // default - UP ARROW or W
		self.inputDown = [40, 83]; // default - UP ARROW or S
		self.inputLeft = [37, 65]; // default - UP ARROW or A
		self.inputRight = [39, 68]; // default - UP ARROW or D
		self.inputFire = [32, 'click']; // default - SPACEBAR
		self.inputSpecial = [16]; // default - SHIFT
	};

	this.setPlayerControls = function(controls) {
		self.inputUp = controls.up;
		self.inputDown = controls.down;
		self.inputLeft = controls.left;
		self.inputRight = controls.right;
		self.inputFire = controls.fire;
		self.inputSpecial = controls.special;
	};

	this.initPlayerControls = function() {
		self.disablePlayerControls();
		self.initInputCheck("keydown", true);
		self.initInputCheck("keyup", false);
		self.allowPlayerInput = true;
	};

	this.disablePlayerControls = function() {
		$(self.combatWindow).undelegate("", "keydown");
		$(self.combatWindow).undelegate("", "keyup");
		self.allowPlayerInput = false;
	};

	this.initInputCheck = function(event_type, activate) {
		$(self.gameWindow).delegate("", event_type, function(e) {
			if($.inArray(e.which, self.inputUp) != -1) {
				self.activeInputs['up'] = activate;
			}
			else if($.inArray(e.which, self.inputDown) != -1) {
				self.activeInputs['down'] = activate;
			}
			else if($.inArray(e.which, self.inputLeft) != -1) {
				self.activeInputs['left'] = activate;
			}
			else if($.inArray(e.which, self.inputRight) != -1) {
				self.activeInputs['right'] = activate;
			}
			else if($.inArray(e.which, self.inputFire) != -1) {
				self.activeInputs['fire'] = activate;
			}
			else if($.inArray(e.which, self.inputSpecial) != -1) {
				self.activeInputs['special'] = activate;
			}
		});
	};

	this.processInputsAndCollisions = function() {
		if(self.activeInputs['up'] && !self.activeInputs['down']) {
			if($(self.playerDiv).position().top > 0 ) {
				$(self.playerDiv).css('top', parseFloat($(self.playerDiv).position().top) - self.playerSpeed);
			}
		}
		if(self.activeInputs['down'] && !self.activeInputs['up']) {
			if($(self.playerDiv).position().top < self.screenHeight - $(self.playerDiv).outerHeight()) {
				$(self.playerDiv).css('top', parseFloat($(self.playerDiv).position().top) + self.playerSpeed);
			}
		}
		if(self.activeInputs['left'] && !self.activeInputs['right']) {
			if($(self.playerDiv).position().left > 0 ) {
				$(self.playerDiv).css('left', parseFloat($(self.playerDiv).position().left) - self.playerSpeed);
				$(self.playerDiv).css('background', '100% no-repeat url(' + self.sprites['player'][0].src + ')');
			}
		}
		if(self.activeInputs['right'] && !self.activeInputs['left']) {
			if($(self.playerDiv).position().left < self.screenWidth - $(self.playerDiv).outerWidth()) {
				$(self.playerDiv).css('left', parseFloat($(self.playerDiv).position().left) + self.playerSpeed);
				$(self.playerDiv).css('background', '100% no-repeat url(' + self.sprites['player'][2].src + ')');
			}
		}
		if((self.activeInputs['right'] && self.activeInputs['left']) || (!self.activeInputs['right'] && !self.activeInputs['left'])) {
			$(self.playerDiv).css('background', '100% no-repeat url(' + self.sprites['player'][1].src + ')');
	    }

		if(self.activeInputs['fire']) {
			d = new Date();
			if(d.getTime() - self.primaryGunCurrentTimer > self.primaryGunRefire) {
				self.primaryGunCurrentTimer = -1;
				self.firePrimaryGun(self.currentPrimaryGun);
				self.primaryGunCurrentTimer = d.getTime();
			}
		}

		if(self.activeInputs['special']) {
			self.teleportSprite(self.playerID, self.currentMousePos.x, self.currentMousePos.y, 'special', "128,128,255", 1.0, self.maxPlayerTeleportDistance);
		}

		d = new Date();
		if(d.getTime() - self.specialCurrentTimer > self.specialCooldown) {
			self.specialCurrentTimer = -1;
			$(self.hudSpecialBarDiv).css('width', "100%");
		}
		if(self.specialCurrentTimer != -1) {
			$(self.hudSpecialBarDiv).css('width', (((d.getTime() - self.specialCurrentTimer) / parseFloat(self.specialCooldown)) * 100) + "%");
		}



        // console.log(self.collisionGrid.grid);
        self.collisionGrid.updateCollisionData();
        var collisions = self.collisionGrid.getAllCollisions(self.collisionGrid.grid);
        //var collisions = self.collisionGrid.getCollisions("player", "enemy", self.collisionGrid.grid);
        //var collisions = self.collisionGrid.getCollisions("enemy", "friendly_weapon", self.collisionGrid.grid);
        if(collisions.length > 0) {
	        console.log(collisions);
        }
	};



	this.drawSprite = function(sprite_id, sprite_class, sprite_image, pos_x, pos_y, sprite_width, sprite_height, z_index, extra_data) {
		var z_index = self.parseUndefined(z_index, 1);
		var extra_data = self.parseUndefined(extra_data, null);
		sprite_div = "#" + sprite_id;

		var extra = "";
		if(extra_data != null) {
			$.each(extra_data, function(key, value) {
				extra += key + "='" + value + "' ";
			});
		}

		if(sprite_image == null) {
            $(self.combatWindow).append("<div id='" + sprite_id + "' class='" + sprite_class + "' style='position:absolute;background:rgb(0,255,0);width:" + sprite_width + "px;height:" + sprite_height + "px;'></div>");
		}
		else {
			self.addOrShowExistingDiv(sprite_id, sprite_class, "z-index:" + z_index + ";position:absolute;background-size:100% 100%;background-repeat:no-repeat;background:url(" + sprite_image.src + ");", extra);

			if(typeof sprite_width !== 'undefined' && sprite_width != -1) {
				$(sprite_div).css('width', sprite_width);
			}
			else {
				$(sprite_div).css('width', sprite_image.width);
			}
			if(typeof sprite_height !== 'undefined' && sprite_height != -1) {
				$(sprite_div).css('height', sprite_height);
			}
			else {
				$(sprite_div).css('height', sprite_image.height);
			}
			img = null;

			var x_offset = $(sprite_div).outerWidth() * 0.5;
			var y_offset = $(sprite_div).outerHeight() * 0.5;
			$(sprite_div).attr('x-limit', self.screenWidth - x_offset);
			$(sprite_div).attr('y-limit', self.screenHeight - y_offset);

			var vertical_position_limit = self.screenHeight - $(sprite_div).outerHeight();
			var horizontal_position_limit = self.screenWidth - $(sprite_div).outerWidth();
			pos_x -= x_offset;
			pos_y -= y_offset;

			if(pos_x > horizontal_position_limit) {
				pos_x = horizontal_position_limit;
			}
			else if(pos_x < 0) {
				pos_x = 0;
			}

			if(pos_y > vertical_position_limit) {
				pos_y = vertical_position_limit;
			}
			else if(pos_y < 0) {
				pos_y = 0;
			}

			$(sprite_div).css('left', pos_x);
			$(sprite_div).css('top', pos_y);
		}
	};



	this.firePrimaryGun = function(gun) {
		if(gun == 'gun1') {
			self.playSound(self.sfx['gun1'], self.sfxVolume, self.primaryGuns[gun][0]['count']);

			self.spawnProjectile(
				gun + '_mid_', 'friendly_weapon ' + gun + '_mid',
				parseFloat($(self.playerDiv).css('left')) + ($(self.playerDiv).outerWidth() * 0.5),
				parseFloat($(self.playerDiv).css('top')),
				self.primaryGuns[gun][0]);

			self.spawnProjectile(
				gun + '_left_', 'friendly_weapon ' + gun + '_left',
				parseFloat($(self.playerDiv).css('left')) + ($(self.playerDiv).outerWidth() * 0.25),
				parseFloat($(self.playerDiv).css('top')),
				self.primaryGuns[gun][1]);

			self.spawnProjectile(
				gun + '_right_', 'friendly_weapon ' + gun + '_right',
				parseFloat($(self.playerDiv).css('left')) + ($(self.playerDiv).outerWidth() * 0.75),
				parseFloat($(self.playerDiv).css('top')),
				self.primaryGuns[gun][2]);
		}
	};



	this.spawnProjectile = function(div_id, div_class, pos_x, pos_y, data, duration, type) {
		duration = self.parseUndefined(duration, -1);
		type = self.parseUndefined(type, 'basic');

		if(data['count'] < data['limit']) {
			self.drawSprite(div_id + data['count'], div_class, data['sprite'], pos_x, pos_y, -1, -1, 1, {'damage': data['damage']});
            self.collisionGrid.addCollisionData("#" + div_id + data['count'], div_class.split(" ")[0], self.collisionGrid.grid);

			if(type == 'basic') {
				self.animateBasicProjectile("#" + div_id + data['count'], div_class, data);
			}
			data['count']++;
		}
		else if($("#" + div_id + 0).css('visibility') == 'hidden') {
			data['count'] = 0;
			self.spawnProjectile(div_id, div_class, pos_x, pos_y, data, duration, type);
		}
	};

	this.animateBasicProjectile = function(div, div_class, data) {
	    if(typeof data['angle'] !== 'undefined' && data['angle'] != null) {
            var xy_ratio = self.polarDegsToXY(data['angle'], data['velocity'] * self.screenHeight);
        }
        else {
            // var velocity_in_pixels = data['velocity'] * self.screenHeight;
            var xy_ratio = [data['velocity_x'] * self.screenWidth, data['velocity_y'] * self.screenHeight];
        }

		clearInterval(self.projectileIntervals[div]);
		self.projectileIntervals[div] = setInterval(function() {
            $(div).css('left', parseFloat($(div).css('left')) + xy_ratio[0]);
            $(div).css('top', parseFloat($(div).css('top')) - xy_ratio[1]);

			if(!self.isInsideCombatWindow(div)) {
				$(div).css('visibility', 'hidden');
				clearInterval(self.projectileIntervals[div]);
				delete self.projectileIntervals[div];
                // self.collisionGrid.removeCollisionData(div, self.collisionGrid.grid);
			}
		}, data['time_interval']);
	};

	this.isInsideCombatWindow = function(div) {
		var pos_x = parseFloat($(div).css('left'));
		var pos_y = parseFloat($(div).css('top'));

		if(
			pos_y < 0 - $(div).outerHeight() ||
			pos_y > self.screenHeight ||
			pos_x < 0 - $(div).outerWidth() ||
			pos_x > self.screenWidth
		) {
			return false;
		}
		else {
			return true;
		}
	};

	this.teleportSprite = function (sprite_id, pos_x, pos_y, sound_effect, flare_rgb, flare_opacity, max_distance) {
		var sprite_div = "#" + sprite_id;
		var sprite_radius = $(sprite_div).outerWidth() * 0.5;
		var sprite_radius_y = $(sprite_div).outerHeight() * 0.5;

		if(pos_x < sprite_radius) {
			pos_x = sprite_radius;
		}
		if(pos_y < sprite_radius_y) {
			pos_y = sprite_radius_y;
		}
		if(pos_x > $(sprite_div).attr('x-limit')) {
			pos_x = $(sprite_div).attr('x-limit');
		}
		if(pos_y > $(sprite_div).attr('y-limit')) {
			pos_y = $(sprite_div).attr('y-limit')
		}

		var d = new Date();
		if(d.getTime() - self.specialCurrentTimer > self.specialCooldown) {
			if(sprite_id == self.playerID) {
				self.playSound(self.sfx[sound_effect]);
			}
			var initial_x = parseFloat($(sprite_div).css('left'));
			var initial_y = parseFloat($(sprite_div).css('top'));
			var pos_x_sprite_center = pos_x - ($(sprite_div).outerWidth() * 0.5);
			var pos_y_sprite_center = pos_y - ($(sprite_div).outerHeight() * 0.5);

			if(max_distance != -1) {
				var angle = self.getAngle(initial_x, initial_y, pos_x_sprite_center, pos_y_sprite_center);
				if(self.getDistance(initial_x, initial_y, pos_x_sprite_center, pos_y_sprite_center) > (self.screenWidth + self.screenHeight) * 0.25) {
                    // pos_x_sprite_center = initial_x + (Math.cos(angle) * max_distance);
                    // pos_y_sprite_center = initial_y + (Math.sin(angle) * max_distance);
                    pos_x = initial_x + (Math.cos(angle) * max_distance);
                    pos_y = initial_y + (Math.sin(angle) * max_distance);
        			pos_x_sprite_center = pos_x - ($(sprite_div).outerWidth() * 0.5);
        			pos_y_sprite_center = pos_y - ($(sprite_div).outerHeight() * 0.5);
				}
			}

			self.createFlareCircle(
				sprite_id + "-origin",
				sprite_radius, $(sprite_div).outerWidth(), $(sprite_div).outerHeight(),
				initial_x, initial_y,
				self.zIndexPlayer + 10,
				sprite_radius, sprite_radius,
				500, 50);
			self.createFlareCircle(
				sprite_id + "-destination",
				sprite_radius, $(sprite_div).outerWidth(), $(sprite_div).outerHeight(),
				pos_x_sprite_center, pos_y_sprite_center,
				self.zIndexPlayer + 10,
				sprite_radius, sprite_radius,
				500, 50);

            self.createLineXY(
                sprite_id + "-lightning-corona",
                0,
                initial_x + ($(sprite_div).outerWidth() * 0.25), initial_y + ($(sprite_div).outerHeight() * 0.25),
                pos_x, pos_y,
                self.zIndexPlayer + 10,
                $(sprite_div).outerWidth() * 4, $(sprite_div).outerWidth() * 4,
                500, 50, 0.25, 0.2);

            self.createLightning(
                sprite_id + "-lightning",
                3, 5,
                $(sprite_div).outerWidth() * 0.05,
                initial_x + ($(sprite_div).outerWidth() * 0.25), initial_y + ($(sprite_div).outerHeight() * 0.25),
                pos_x, pos_y,
                self.zIndexPlayer + 10,
                0, 0,
                250, 25, 1.0, 0.9, "255,255,255", "128,128,255", "255,255,255", "128,128,255");

            // Super-Nova (Quantum-Tunneling to the same spot = big boom)
			if(sprite_id == self.playerID && self.getDistance(initial_x, initial_y, pos_x_sprite_center, pos_y_sprite_center) < $(sprite_div).outerWidth()) {
				self.playSound(self.sfx["special-nova"]);
				self.createFlareCircle(
					sprite_id + "-nova",
					sprite_radius, $(sprite_div).outerWidth(), $(sprite_div).outerHeight(),
					pos_x_sprite_center, pos_y_sprite_center,
					self.zIndexPlayer - 10,
					sprite_radius, sprite_radius,
					500, 50,
					0.0, 0.0, "128,128,255", "128,128,255",
					1.0, 0.9, "128,128,255", "128,128,255",
					500, 25,
					sprite_radius, $(sprite_div).outerWidth(), $(sprite_div).outerHeight(),
					$(sprite_div).outerWidth() * 4, $(sprite_div).outerWidth() * 8, $(sprite_div).outerHeight() * 8);
			}


			d = new Date();
			self.specialCurrentTimer = d.getTime();
			$(sprite_div).css('left', pos_x_sprite_center);
			$(sprite_div).css('top', pos_y_sprite_center);
		}
	};



    this.addOrShowExistingDiv = function(div_id, div_class, style, extra_properties) {
        div = "#" + div_id;
		if($(div).length < 1) {
			$(self.combatWindow).append("<div id='" + div_id + "' class='" + div_class + "' style='" + style + "' " + extra_properties + "></div>");
		}
		else {
			$(div).css('visibility', 'visible');
		}
    };

	this.createLightning = function(
	    div_id,
	    bolts, segments,
	    width,
	    x1, y1,
	    x2, y2,
	    z_index,
	    blur, spread,
	    duration, duration_delta, opacity_start, opacity_end, rgb_start, rgb_end) {

        var current_x;
        var current_y;
        var next_x;
        var next_y;
        for (var bolt_count = 0; bolt_count < bolts; bolt_count++) {
            current_x = x1;
            current_y = y1;
            for (var segment_count = 0; segment_count < segments; segment_count++) {
                if(segment_count < segments - 1) {
                    next_x = current_x + ((x2 - x1) / segments);
                    next_y = current_y + ((y2 - y1) / segments);
                    next_x += self.rand(0, next_x * 0.1 * ((Math.round(Math.random()) * 2) - 1));
                    next_y += self.rand(0, next_y * 0.1 * ((Math.round(Math.random()) * 2) - 1));
                }
                else {
                    next_x = x2;
                    next_y = y2;
                }

                self.createLineXY(
                    div_id + bolt_count + segment_count,
                    width,
                    current_x, current_y,
                    next_x, next_y,
                    z_index,
                    blur, spread,
                    duration, duration_delta, opacity_start, opacity_end, rgb_start, rgb_end, rgb_start, rgb_end
                );

                current_x = next_x;
                current_y = next_y;
            }
        }
    };

	this.createFlareCircle = function(
		div_id,
		radius, width, height,
		pos_x, pos_y,
	    z_index,
	    blur, spread,
		duration, duration_delta,
		opacity_start, opacity_end, rgb_start, rgb_end,
		box_shadow_opacity_start, box_shadow_opacity_end, rgb_box_shadow_start, rgb_box_shadow_end,
		scale_duration, scale_duration_delta, radius_start, width_start, height_start, radius_end, width_end, height_end) {

		var flare_container = "#" + div_id;
		var z_index = self.parseUndefined(z_index, 1);

		self.addOrShowExistingDiv(div_id, "flare-circle", "position:absolute;z-index:" + z_index);
		$(flare_container).css('width', width + "px");
		$(flare_container).css('height', height + "px");
		$(flare_container).css('left', pos_x + "px");
		$(flare_container).css('top', pos_y + "px");
        $(flare_container).css('background-color', "rgba(" + rgb_start + "," + opacity_start + ")");
		self.setCSS3Property("border-radius", flare_container, "50%");
		self.setCSS3Property("box-shadow", flare_container, '0px 0px ' + blur + 'px ' + spread + 'px rgba(' + rgb_box_shadow_start + ',' + box_shadow_opacity_start + ')');

		var duration = self.parseUndefined(duration, -1);
		if(duration != -1) {
			self.animateTransitionRGBA(
				flare_container,
				blur, spread,
				duration, duration_delta,
				opacity_start, opacity_end, rgb_start, rgb_end,
				box_shadow_opacity_start, box_shadow_opacity_end, rgb_box_shadow_start, rgb_box_shadow_end);
		}

		var scale_duration = self.parseUndefined(scale_duration, -1);
		if(scale_duration != -1) {
       		self.animateScale(
       			flare_container,
       			scale_duration, scale_duration_delta,
       			radius_start, width_start, height_start,
       			radius_end, width_end, height_end);
       	}
	};

	this.createLineXY = function(
	    div_id,
	    width,
	    x1, y1,
	    x2, y2,
	    z_index,
	    blur, spread,
	    duration, duration_delta, opacity_start, opacity_end, rgb_start, rgb_end, rgb_box_shadow_start, rgb_box_shadow_end) {

		self.createLine(
		    div_id, width, x1, y1, self.getDistance(x1, y1, x2, y2), 180 * (self.getAngle(x1, y1, x2, y2) / Math.PI), z_index,
		    blur, spread,
		    duration, duration_delta, opacity_start, opacity_end, rgb_start, rgb_end);
	};

	this.createLine = function(
	    div_id,
	    width,
	    x1, y1,
	    length, angle,
	    z_index,
	    blur, spread,
	    duration, duration_delta, opacity_start, opacity_end, rgb_start, rgb_end) {

		var duration = self.parseUndefined(duration, -1);
        var line_container = "#" + div_id;
		var z_index = self.parseUndefined(z_index, 1);

		self.addOrShowExistingDiv(div_id, "line", "position:absolute;");

        $(line_container).css('z-index', z_index);
        $(line_container).css('height', width + "px");
        $(line_container).css('width', length + "px");
        $(line_container).css('left', x1 + "px");
        $(line_container).css('top', (y1 - (width * 0.5)) + "px");
        $(line_container).css('background-color', "rgba(" + rgb_start + "," + opacity_start + ")");

		self.setCSS3Property("transform-origin", line_container, "0% 50%");
        self.setRotation(line_container, angle);

		if(duration != -1) {
			self.animateTransitionRGBA(
				line_container,
				blur, spread,
				duration, duration_delta,
				opacity_start, opacity_end, rgb_start, rgb_end,
				opacity_start, opacity_end, rgb_start, rgb_end);
		}
    };

	this.animateTransitionRGBA = function(
		div,
		blur, spread,
		duration, duration_delta,
		opacity_start, opacity_end, rgb_start, rgb_end,
		box_shadow_opacity_start, box_shadow_opacity_end, rgb_box_shadow_start, rgb_box_shadow_end) {

		var blur = self.parseUndefined(blur, 0);
		var spread = self.parseUndefined(spread, 0);

		var duration_delta = self.parseUndefined(duration_delta, 50);
		var opacity_start = self.parseUndefined(opacity_start, 1.0);
		var opacity_end = self.parseUndefined(opacity_end, 0.0);
		var rgb_start = self.parseUndefined(rgb_start, "128,128,255");
		var rgb_end = self.parseUndefined(rgb_end, "128,128,255");

		var box_shadow_opacity_start = self.parseUndefined(box_shadow_opacity_start, 1.0);
		var box_shadow_opacity_end = self.parseUndefined(box_shadow_opacity_end, 0.0);
		var rgb_box_shadow_start = self.parseUndefined(rgb_box_shadow_start, "128,128,255");
		var rgb_box_shadow_end = self.parseUndefined(rgb_box_shadow_end, "128,128,255");

        var step_count = duration / duration_delta;
 		var op_bg = opacity_start;
 		var opacity_increment_bg = (opacity_start - opacity_end) / step_count;
 		var op_box = box_shadow_opacity_start;
 		var opacity_increment_box = (box_shadow_opacity_start - box_shadow_opacity_end) / step_count;

		var is_rgb_changed = false;
 	    if(rgb_start != rgb_end) {
			var is_rgb_changed = true;
     		var rgb_start_values = rgb_start.split(",");
     		var rgb_end_values = rgb_end.split(",");
     		var rgb_increments = new Array();

     		$.each(rgb_start_values, function(i, entry) {
         		rgb_increments.push((rgb_start_values[i] - rgb_end_values[i]) / step_count);
     	    });
        }

		var is_rgb_box_shadow_changed = false;
        if(rgb_box_shadow_start != rgb_box_shadow_end && (blur > 0 || spread > 0)) {
			var is_rgb_box_shadow_changed = true;
     		var rgb_box_shadow_start_values = rgb_box_shadow_start.split(",");
     		var rgb_box_shadow_end_values = rgb_box_shadow_end.split(",");
     		var rgb_box_shadow_increments = new Array();

     		$.each(rgb_box_shadow_start_values, function(i, entry) {
         		rgb_box_shadow_increments.push((rgb_box_shadow_start_values[i] - rgb_box_shadow_end_values[i]) / step_count);
     	    });
        }

 		var transition_rgba_interval = setInterval(function() {
 		    if(is_rgb_changed) {
     			$(div).css('background-color', 'rgba(' + rgb_start_values.join(',') + ',' + op_bg + ')');
         		$.each(rgb_start_values, function(i, entry) {
             		rgb_start_values[i] = parseInt(rgb_start_values[i] - rgb_increments[i]);
         	    });
 	        }

 		    if(is_rgb_box_shadow_changed) {
				$(div).css('box-shadow', '0px 0px ' + blur + 'px ' + spread + 'px rgba(' + rgb_box_shadow_start_values.join(',') + ',' + op_box + ')');
         		$.each(rgb_start_values, function(i, entry) {
             		rgb_box_shadow_start_values[i] = parseInt(rgb_box_shadow_start_values[i] - rgb_box_shadow_increments[i]);
         	    });
 	        }

 	        else {
     			$(div).css('background-color', 'rgba(' + rgb_start + ',' + op_bg + ')');
     			if(blur > 0 || spread > 0) {
         			$(div).css('box-shadow', '0px 0px ' + blur + 'px ' + spread + 'px rgba(' + rgb_box_shadow_start + ',' + op_box + ')');
 			    }
             }

 			op_bg -= opacity_increment_bg;
 			op_box -= opacity_increment_box;
 
 			if(op_bg < opacity_end || op_box < box_shadow_opacity_end) {
                $(div).css('visibility', 'hidden');
 				clearInterval(transition_rgba_interval);
 			}
 		}, duration_delta);
    };

    this.animateScale = function(
    	div,
    	scale_duration, scale_duration_delta,
    	radius_start, width_start, height_start,
    	radius_end, width_end, height_end) {

        var step_count = scale_duration / scale_duration_delta;
 		var sr = radius_start;
 		var sw = width_start;
 		var sh = height_start;
 		var sr_increment = (radius_start - radius_end) / step_count;
 		var sw_increment = (width_start - width_end) / step_count;
 		var sh_increment = (height_start - height_end) / step_count;

 		var transition_scale_interval = setInterval(function() {
 			sr -= sr_increment;
 			sw -= sw_increment;
 			sh -= sh_increment;

	 		$(div).css('width', sw);
	 		$(div).css('height', sh);
	 		$(div).css('left', parseFloat($(div).css('left')) + (sw_increment * 0.5));
	 		$(div).css('top', parseFloat($(div).css('top')) + (sh_increment * 0.5));

 			if((radius_start > radius_end && sr < radius_end) || (radius_start <= radius_end && sr > radius_end)) {
                $(div).css('visibility', 'hidden');
 				clearInterval(transition_scale_interval);
 			}
 		}, scale_duration_delta);
    };



	this.loadImage = function(file) {
		var image = new Image();
    	image.onload = function() {
    		this.isLoaded = 1;
    	};

    	image.src = self.gamePath + file;
    	return image;
    };

	this.loadSound = function(file) {
		var audio = new Audio();

    	audio.addEventListener(
    		'canplaythrough',
    		function() {
    			this.isLoaded = 1;
    			this.isPlaying = false;
    		},
    		false)

		audio.addEventListener('ended', function() {
			this.isPlaying = false;
		}, false);

        var ext;
        if(audio.canPlayType('audio/mpeg;')) {
            audio.type = 'audio/mpeg';
            ext = ".mp3";
        }
        else if(audio.canPlayType('audio/ogg;')) {
            audio.type = 'audio/ogg';
            ext = ".ogg";
        }
        else {
            audio.type = "";
        	audio.src = "";
            return audio;
        }

    	audio.src = self.gamePath + file + ext;
    	return audio;
    };

    this.playSound = function(sfx_entry, volume, index) {
    	var audio = self.getAudioObject(sfx_entry, index);
    	if(audio == null) {
    		return;
    	}
   		if(typeof volume === 'undefined') {
	    	audio.volume = self.sfxVolume;
    	}
    	else {
	    	audio.volume = volume;
    	}

    	audio.play();
    	audio.isPlaying = true;
    }

    this.playMusic = function(music_entry, volume) {
    	var audio = self.getAudioObject(music_entry);
    	if(audio == null) {
    		return;
    	}
   		if(typeof volume === 'undefined') {
	    	audio.volume = self.musicVolume;
    	}
    	else {
	    	audio.volume = volume;
    	}

		audio.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
		audio.play();
		audio.isPlaying = true;
    };

	this.pauseAudio = function(music_entry, time) {
		time = self.parseUndefined(time, -1);
    	var audio = self.getAudioObject(music_entry);
    	if(audio == null) {
    		return;
    	}
    	audio.pause();
    	audio.isPlaying = false;
    	if(time != -1) {
    		audio.currentTime = 0;
    	}
    };

    this.getAudioObject = function(entry, index) {
    	if(typeof entry === 'undefined' || entry.length < 1) {
    		return null;
    	}
    	else if(entry.length == 1) {
	    	return entry[0];
    	}
    	else {
    		if(typeof index === 'undefined') {
    			return entry[Math.round(self.rand(0, entry.length - 1))];
    		}
    		else {
    			return entry[index];
    		}
    	}
    };

    this.checkLoadProgress = function(data_object) {
    	var file_count = 0;
    	var loaded_count = 0;
    	$.each(data_object, function(key, entry) {
    		file_count++;
    		$.each(entry, function(index, resource) {
    			if(resource.isLoaded == 1) {
    				loaded_count++;
    			}
    		});
    	});
    	if(file_count <= 0) {
	    	return 1;
    	}
    	else {
	    	return loaded_count / file_count;
    	}
    };

    this.setGamePath = function() {
    	var script_url;
    	var path = "";
		$.each($(document).find("script"), function(index, script) {
			script_url = script.src.split(self.scriptFileName);
			if(script_url.length == 2) {
				self.gamePath= script_url[0];
				return;
			}
		});
    };



    this.drawHUD = function(rgba_hud, rgba_hp, rgba_special, rgba_buttons, rgba_text) {
		$(self.hudWindow).css('background', rgba_hud);

		self.drawHUDElement(
			self.hudHPBarID, 30, 20, 35, 60, rgba_hp, rgba_text,
			"", "border-style:double;border-width;0.1%;border-color:rgba(255,255,255,0.5);");
		self.setCSS3Property("border-radius", self.hudHPBarDiv + "-wrapper", ($(self.hudHPBarDiv).outerHeight() * 0.5) + "px");

		self.drawHUDElement(
			self.hudSpecialBarID, 30, 20, 35, 20, rgba_special, rgba_text,
			"", "border-style:double;border-width;0.1%;border-color:rgba(255,255,255,0.5);");
		self.setCSS3Property("border-radius", self.hudSpecialBarDiv + "-wrapper", ($(self.hudSpecialBarDiv).outerHeight() * 0.5) + "px");

		self.drawHUDElement(self.hudCtrlUpID, 4, 25, 12, 5, rgba_buttons, rgba_text,
			"U", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlDownID, 4, 25, 12, 65, rgba_buttons, rgba_text,
			"D", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlLeftID, 4, 25, 7, 35, rgba_buttons, rgba_text,
			"L", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlRightID, 4, 25, 17, 35, rgba_buttons, rgba_text,
			"R", "", "", "class='sw-hud-control-button'");

		self.drawHUDElement(self.hudCtrlUpLeftID, 4, 25, 7, 5, rgba_buttons, rgba_text,
			"UL", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlUpRightID, 4, 25, 17, 5, rgba_buttons, rgba_text,
			"UR", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlDownLeftID, 4, 25, 7, 65, rgba_buttons, rgba_text,
			"DL", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlDownRightID, 4, 25, 17, 65, rgba_buttons, rgba_text,
			"DR", "", "", "class='sw-hud-control-button'");

		self.drawHUDElement(self.hudCtrlFireID, 8, 35, 75, 40, rgba_buttons, rgba_text,
			"FIRE", "", "", "class='sw-hud-control-button'");
		self.drawHUDElement(self.hudCtrlSpecialID, 8, 35, 85, 40, rgba_buttons, rgba_text,
			"SPC", "", "", "class='sw-hud-control-button'");

		self.initHudButtons(
			self.hudWindow, ".sw-hud-control-button",
			rgba_buttons, rgba_text,
			"rgba(0,128,0, 1.0)", "rgba(255,0,0, 1.0)");
    }

	this.drawHUDElement = function(
		div_id,
		width, height,
		left, top,
		rgba_background, rgba_text,
		text,
		extra_styling, extra_wrapper_params, extra_element_params) {

		text = self.parseUndefined(text, "");
		extra_styling = self.parseUndefined(extra_styling, "");
		extra_wrapper_params = self.parseUndefined(extra_wrapper_params, "");
		extra_element_params = self.parseUndefined(extra_element_params, "");

		$(self.hudWindow).append(
			"<div id='" + div_id + "-wrapper' " + extra_wrapper_params + " style='position:absolute;width:" + width + "%;height:" + height + "%;left:" + left + "%;top:" + top + "%;" + extra_styling + "'><div id='" + div_id + "' " + extra_element_params + " style='width:100%;height:100%;background-color:" + rgba_background + ";color:" + rgba_text + ";text-align:center;font-family:Courier,monospace;font-size:100%;'>" + text + "</div></div>"
		);
    };

    this.initHudButtons = function(
    	container, selector,
    	rgba_background_normal, rgba_text_normal,
    	rgba_background_hover, rgba_text_hover) {

		$(self.hudWindow).delegate(".sw-hud-control-button", "mouseenter mouseleave mousedown mouseup", function(event) {
			if(event.type === 'mouseenter') {
				$(this).css('background-color', rgba_background_hover);
				$(this).css('color', rgba_text_hover);
			}
			else if(event.type === 'mouseleave') {
				$(this).css('background-color', rgba_background_normal);
				$(this).css('color', rgba_text_normal);
			}
			else {
				var inputs = $(this).attr('id').split(self.hudCtrlPrefix)[1].split('-');
				if(event.type === 'mousedown') {
					var active = true;
				}
				else {
					var active = false;
				}

				$.each(inputs, function(index, input) {
					self.activeInputs[input] = active;
				});
			}
		});
    }



    this.rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };

	/*
	* 1337 tr1g h4x, YEABOI
	*/
	this.getAngle = function(x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1);
	};

	this.polarDegsToXY = function(degs, slope) {
		return self.polarRadsToXY(degs * self.deg2rad, slope);
	};

	this.polarRadsToXY = function(rads, slope) {
		return [slope * Math.cos(rads), slope * Math.sin(rads)];
	};

	this.getDistance = function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	};

    this.setCSS3Property = function(property_name, div, value) {
		$(div).css('-webkit-' + property_name, value);
		$(div).css('-moz-' + property_name, value);
		$(div).css('-ms-' + property_name, value);
		$(div).css(property_name, value);
    };

    // will need to rewrite to replace rotate() inside the transform property, if there's other transforms on the element
    this.setRotation = function(div, value) {
		self.setCSS3Property("transform", div, "rotate(" + value + "deg)");
    };

    this.parseUndefined = function(param, default_value) {
        if(typeof(param)==='undefined') {
            return default_value;
        }
        return param;
    };



	self.init(game_div);
}