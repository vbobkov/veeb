// qt
var QuadTree = function(width, height) {
    var self = this;
    this.quadMaxElements = 4;
    this.quadMaxDepth = 4;
    this.grid = null;





    this.init = function(width, height) {
        self.grid = {
        	//[left,top,width,height]
        	'dimensions': {
        	    'x': 0,
        	    'y': 0,
        	    'width': width,
        	    'height': height},

        	// array of div selectors belonging to this quad (if it's too small for the child quads)
        	'friendly_weapon': [],
        	'enemy_weapon': [],
        	'enemy': [],
        	'player': [],

        	// children (always half-width and half-height of parent) - [upper-left, upper-right, lower-left, lower-right]
        	'children': {
        	    'upper_left': null,
        	    'upper_right': null,
        	    'lower_left': null,
        	    'lower_right': null
        	},

        	//parent
        	'parent': null,

        	// total elements, including sub-sector elements
        	'total_elements': 0
        };
    };





	this.getClassIndex = function(element_class) {
		switch(element_class) {
			case "friendly_weapon":
				return 'friendly_weapon';
				break;
			case "enemy_weapon":
				return 'enemy_weapon';
				break;
			case "enemy":
				return 'enemy';
				break;
			case "player":
				return 'player';
				break;
			default:
				return -1;
				break;
		}
	};



	this.updateTotalElements = function(sector, increment) {
		sector['total_elements'] += increment;
		if(sector['parent'] != null) {
			self.updateTotalElements(sector['parent'], increment);
		}
	};



    this.splitCollisionQuad = function(sector) {
        if(sector.length < 8) {
            return null;
        }

    	var half_width = sector['dimensions']['width'] * 0.5;
    	var half_height = sector['dimensions']['height'] * 0.5;

        // initialize the sub-sectors
    	sector['children'] = {
    		'upper_left': {
            	'dimensions': {
            	    'x': sector['dimensions']['x'],
            	    'y': sector['dimensions']['y'],
            	    'width': half_width,
            	    'height': half_height},
            	'friendly_weapon': [],
            	'enemy_weapon': [],
            	'enemy': [],
            	'player': [],
            	'children': {
            	    'upper_left': null,
            	    'upper_right': null,
            	    'lower_left': null,
            	    'lower_right': null
            	},
            	'parent': sector,
            	'total_elements': 0
    		},
    		'upper_right': {
            	'dimensions': {
            	    'x': sector['dimensions']['x'] + half_width,
            	    'y': sector['dimensions']['y'],
            	    'width': half_width,
            	    'height': half_height},
            	'friendly_weapon': [],
            	'enemy_weapon': [],
            	'enemy': [],
            	'player': [],
            	'children': {
            	    'upper_left': null,
            	    'upper_right': null,
            	    'lower_left': null,
            	    'lower_right': null
            	},
            	'parent': sector,
            	'total_elements': 0
    		},
    		'lower_left': {
            	'dimensions': {
            	    'x': sector['dimensions']['x'],
            	    'y': sector['dimensions']['y'] + half_height,
            	    'width': half_width,
            	    'height': half_height},
            	'friendly_weapon': [],
            	'enemy_weapon': [],
            	'enemy': [],
            	'player': [],
            	'children': {
            	    'upper_left': null,
            	    'upper_right': null,
            	    'lower_left': null,
            	    'lower_right': null
            	},
            	'parent': sector,
            	'total_elements': 0
    		},
    		'lower_right': {
            	'dimensions': {
            	    'x': sector['dimensions']['x'] + half_width,
            	    'y': sector['dimensions']['y'] + half_height,
            	    'width': half_width,
            	    'height': half_height},
            	'friendly_weapon': [],
            	'enemy_weapon': [],
            	'enemy': [],
            	'player': [],
            	'children': {
            	    'upper_left': null,
            	    'upper_right': null,
            	    'lower_left': null,
            	    'lower_right': null
            	},
            	'parent': sector,
            	'total_elements': 0
    		}
    	};

        // redistribute the node's elements to the newly formed sub-sectors
		var friendly_weapons = [];
		var enemy_weapons = [];
		var enemies = [];
		var players = [];
        if(sector['friendly_weapon'].length > 0) {
			var friendly_weapons = sector['friendly_weapon'].slice(0);
			sector['friendly_weapon'] = [];
		}
        if(sector['enemy_weapon'].length > 0) {
			var enemy_weapons = sector['enemy_weapon'].slice(0);
			sector['enemy_weapon'] = [];
        }
        if(sector['enemy'].length > 0) {
			var enemies = sector['enemy'].slice(0);
			sector['enemy'] = [];
		}
        if(sector['player'].length > 0) {
			var players = sector['player'].slice(0);
			sector['player'] = [];
		}

        var increment = -1 * (friendly_weapons.length + enemy_weapons.length + enemies.length + players.length);
        self.updateTotalElements(sector, increment);
        //console.log(sector['total_elements']);

		for(var i = 0; i < friendly_weapons.length; i++) {
			self.addCollisionData(friendly_weapons[i], 'friendly_weapon', sector);
		}

		for(var i = 0; i < enemy_weapons.length; i++) {
			self.addCollisionData(enemy_weapons[i], 'enemy_weapon', sector);
		}

		for(var i = 0; i < enemies.length; i++) {
			self.addCollisionData(enemies[i], 'enemy', sector);
		}

		for(var i = 0; i < players.length; i++) {
			self.addCollisionData(players[i], 'player', sector);
		}
		//console.log(sector['total_elements']);
    };



    this.mergeCollisionQuads = function (sector) {
    	console.log('wtf');
        if(sector.length < 8) {
            return null;
        }

    	sector['friendly_weapon'] =
    		sector['children']['upper_left']['friendly_weapon']
    			.concat(
    				sector['children']['upper_right']['friendly_weapon'],
    				sector['children']['lower_left']['friendly_weapon'],
    				sector['children']['lower_right']['friendly_weapon']);

    	sector['enemy_weapon'] =
    		sector['children']['upper_left']['enemy_weapon']
    			.concat(
    				sector['children']['upper_right']['enemy_weapon'],
    				sector['children']['lower_left']['enemy_weapon'],
    				sector['children']['lower_right']['enemy_weapon']);

    	sector['enemy'] =
    		sector['children']['upper_left']['enemy']
    			.concat(
    				sector['children']['upper_right']['enemy'],
    				sector['children']['lower_left']['enemy'],
    				sector['children']['lower_right']['enemy']);

    	sector['player'] =
    		sector['children']['upper_left']['player']
    			.concat(
    				sector['children']['upper_right']['player'],
    				sector['children']['lower_left']['player'],
    				sector['children']['lower_right']['player']);

    	sector['children'] = [null, null, null, null];
    	sector['total_elements'] = sector['friendly_weapon'].length + sector['enemy_weapon'].length + sector['enemy'].length + sector['player'].length;
    };



    this.addCollisionData = function (div, collision_class, sector) {
        // if(is_inside < 2 || sector.length < 8 || self.getCollisionData2(div, collision_class, sector) != null) {
        if(sector.length < 8 || $(div).css('visibility') == 'hidden') {
            return;
        }

        if(sector['total_elements'] >= self.quadMaxElements && sector['children']['upper_left'] == null) {
            //console.log(sector['total_elements']);
            self.splitCollisionQuad(sector);
    	}

        var is_inside = self.isInsideSector(div, sector);
        if(is_inside < 2) {
            if(sector['parent'] != null) {
                self.addCollisionData(div, collision_class, sector['parent']);
                return;
            }
        }

    	if(sector['children']['upper_left'] != null) {
    		$.each(sector['children'], function(name, child) {
        		is_inside = self.isInsideSector(div, child);
        		if(is_inside > 1) {
        			self.addCollisionData(div, collision_class, child);
        		}
		    });
    	}
    	else {
    		sector[collision_class].push(div);
    		self.updateTotalElements(sector, 1);
	    }
    };



    this.removeCollisionData = function (div, sector) {
    	self.removeCollisionData2(div, self.getClassIndex($(div).attr('class').split(" ")[0]), sector);
    };

    this.removeCollisionData2 = function (div, collision_class, sector) {
        if(sector.length < 8) {
            return null;
        }

        console.log(div);
    	var div_index = sector[collision_class].indexOf(div);
    	if(div_index != -1) {
    		sector[collision_class].splice(div_index, 1);
    		self.updateTotalElements(sector, -1);
    		console.log(sector[collision_class]);
			if(sector['parent']['total_elements'] < self.quadMaxElements) {
    			self.mergeCollisionQuads(sector['parent']);
    		}
    	}
    	else if(sector['children']['upper_left'] != null) {
			$.each(sector['children'], function(name, child) {
				is_inside = self.isInsideSector(div, child);
				if(is_inside > 1) {
					self.removeCollisionData2(div, collision_class, child);
				}
			});
    	}
    };



    this.getCollisionData = function (div, sector) {
		self.getCollisionData2(div, self.getClassIndex($(div).attr('class').split(" ")[0]), sector);
    };

    this.getCollisionData2 = function (div, collision_class, sector) {
        if(sector.length < 8) {
            return null;
        }

    	var div_index = sector[collision_class].indexOf(div);
    	if(div_index != -1) {
    	    return sector[collision_class][div_index];
    	}
    	else {
    	    var collision_data;
    	    if(sector['children']['upper_left'] != null) {
        		$.each(sector['children'], function(name, child) {
            		collision_data = self.getCollisionData2(div, collision_class, child);
            		if(collision_data != null) {
            		    return collision_data;
            		}
        	    });
	        }
    	    return null;
    	}
    };



    this.updateCollisionData = function() {
    	self.init(self.grid['dimensions']['width'], self.grid['dimensions']['height']);

		$("#sw-game-combat .friendly_weapon").each(function() {
			self.addCollisionData("#" + $(this).attr('id'), 'friendly_weapon', self.grid);
    	});

		$("#sw-game-combat .enemy_weapon").each(function() {
			self.addCollisionData("#" + $(this).attr('id'), 'enemy_weapon', self.grid);
		});

		$("#sw-game-combat .enemy").each(function() {
			self.addCollisionData("#" + $(this).attr('id'), 'enemy', self.grid);
		});

		$("#sw-game-combat .player").each(function() {
			self.addCollisionData("#" + $(this).attr('id'), 'player', self.grid);
		});

    	/*
        if(sector.length < 8) {
            return null;
        }

        var collision_classes = ['friendly_weapon', 'enemy_weapon', 'enemy', 'player'];
        var is_inside;
        var sub_sector_match;
    	for(var j = 0; j < collision_classes.length; j++) {
			for(var i = 0; i < sector[collision_classes[j]].length; i++) {
				sub_sector_match = false;
				if(sector['children']['upper_left'] != null) {
					console.log('0?');
            		$.each(sector['children'], function(name, child) {
						if(!sub_sector_match) {
							is_inside = self.isInsideSector(sector[collision_classes[j]][i], child);
							if(is_inside > 1) { // the element fits inside an existing sub-sector, yay
								sub_sector_match = true;
								console.log('1?');
								self.addCollisionData(sector[collision_classes[j]][i], collision_classes[j], child);

								sector[collision_classes[j]].splice(i, 1);
								self.updateTotalElements(sector, -1);
								console.log('1??');
							}
						}
						self.updateCollisionData(child);
					});
				}

				// either the element fits into a sub-sector (and was already moved there), or it fully fits inside this sector, so go on to the next element
				is_inside = self.isInsideSector(sector[collision_classes[j]][i], sector);
				if(sub_sector_match || is_inside > 1) {
					continue;
				}
				// the element either doesn't fit at all, or partially fits
				else {
					// since the element doesn't fully fit in this sector, remove it from here
					var div_to_move = sector[collision_classes[j]][i];
					sector[collision_classes[j]].splice(i, 1);
					self.updateTotalElements(sector, -1);
					console.log('2?');

					// since it's only partial/no fit, if this sector has a parent, add it there
					if(sector['parent'] != null) {
    					console.log('2??');
						self.addCollisionData(div_to_move, collision_classes[j], sector['parent']);
					}
				}
			}
        }

		if(sector['parent'] != null && sector['parent']['total_elements'] <= self.quadMaxElements) {
			console.log('3?');
			self.mergeCollisionQuads(sector['parent']);
		}
		else if(sector['total_elements'] > self.quadMaxElements) {
			console.log('4?');
			self.splitCollisionQuad(sector);
	    }
	    */
    };



    this.getCollisions = function(class1, class2, sector, remove_matches_from_collision_tree) {
    	remove_matches_from_collision_tree = self.parseUndefined(remove_matches_from_collision_tree, false);

    	var collision_list = [];
        if(sector.length < 8 || $(div).length < 1) {
            return collision_list;
        }

    	var is_inside;
    	var current_element;

    	if(self.isInsideSector(div, sector) > 0) {
    		// TO DO: add a check for parent-child collisions, since not all elements may fit into the smaller sectors
			for(var i = 0; i < sector[class1].length; i++) {
				for(var j = 0; j < sector[class2].length; j++) {
					if(self.rectangleIntersect(sector[class1][i], sector[class2][j])) {
						console.log(sector[class1][i], sector[class2][j]);
						collision_list.push(sector[class2][j]);
						if(remove_matches_from_collision_tree) {
							sector[class2].splice(j, 1);
							self.updateTotalElements(sector, -1);
						}
					}
				}
			}

        	if(sector['children']['upper_left'] != null) {
        		var collisions;
        		$.each(sector['children'], function(name, child) {
        		    collisions = self.getCollisions(class1, class2, child, remove_matches_from_collision_tree);
        		    collision_list.concat(collisions);
        	    });
        	}
        }

		if(collision_list.length > 0) {
			//console.log(collision_list);
		}
    	return collision_list;
    };

    this.getAllCollisions = function(sector) {
    	var all_collisions = {
    		'enemies': [],
    		'players': []
    	};
    	var collisions;

    	if(self.isInsideSector(div, sector) > 0) {
			for(var i = 0; i < sector['enemy'].length; i++) {
				all_collisions['enemies'].concat(self.getCollisions('enemy', 'friendly_weapon', sector));
				all_collisions['enemies'].concat(self.getCollisions('enemy', 'player', sector));
			}

			for(var i = 0; i < sector['player'].length; i++) {
				all_collisions['players'].concat(self.getCollisions('player', 'enemy_weapon', sector));
				all_collisions['players'].concat(self.getCollisions('player', 'enemy', sector));
			}

        	if(sector['children']['upper_left'] != null) {
        		$.each(sector['children'], function(name, child) {
        			collisions = self.getAllCollisions(child);
        		    all_collisions['enemies'].concat(collisions['enemies']);
        		    all_collisions['players'].concat(collisions['players']);
        	    });
        	}
		}

		if(all_collisions.length > 0) {
			console.log(all_collisions);
		}
		return all_collisions;
    };



    this.isInsideSector = function(div, sector) {
        if(sector.length < 8) {
            return null;
        }

    	var pos_x = parseFloat($(div).css('left'));
    	var pos_y = parseFloat($(div).css('top'));
    	var width = parseFloat($(div).css('width'));
    	var height = parseFloat($(div).css('height'));
    	var pos_x2 = pos_x + width;
    	var pos_y2 = pos_y + height;

        var upper_left =
            pos_x >= sector['dimensions']['x'] &&
            pos_y >= sector['dimensions']['y'];
        var lower_right =
            pos_x2 <= sector['dimensions']['x'] + sector['dimensions']['width'] &&
            pos_y2 <= sector['dimensions']['y'] + sector['dimensions']['height'];

    	// is_completely_inside
    	if(!(pos_x > sector['dimensions']['x'] + sector['dimensions']['width'] ||
                pos_y > sector['dimensions']['y'] + sector['dimensions']['height'] ||
                pos_x + width < sector['dimensions']['x'] ||
                pos_y + height < sector['dimensions']['y'])) {
    		return 2;
    	}

    	// is_partially_inside	
    	else if(!(pos_x < sector['dimensions']['x'] ||
    		pos_y < sector['dimensions']['y'] ||
    		pos_x2 > sector['dimensions']['x'] + sector['dimensions']['width'] ||
    		pos_y2 > sector['dimensions']['y'] + sector['dimensions']['height'])) {
    		return 1;
    	}

    	// not inside at all
    	else {
    		return 0;
    	}
    };



    this.rectangleIntersect = function(div1, div2) {
    	var div1_x = parseFloat($(div1).css('left'));
    	var div1_y = parseFloat($(div1).css('top'));
    	var div2_x = parseFloat($(div2).css('left'));
    	var div2_y = parseFloat($(div2).css('top'));
        return !(div1_x > div2_x + parseFloat($(div2).css('width')) ||
                div1_y > div2_y + parseFloat($(div2).css('height')) ||
                div1_x + parseFloat($(div1).css('width')) < div2_x ||
                div1_y + parseFloat($(div1).css('height')) < div2_y);
    };



    this.parseUndefined = function(param, default_value) {
        if(typeof(param)==='undefined') {
            return default_value;
        }
        return param;
    };



    self.init(width, height);
}