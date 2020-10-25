var game_settings = {
	sound: true,
	difficulty: 'easy',
}
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		this.add.sprite(config.width/2, config.height/2, 'bg_game');
		let self = this;
		let state = 'play';
		let tiles = this.add.group();
		let turn = 1;
		let board = {
			width: 3,
			height: 3,
		}
		let size = {
			width: 180,
			height: 180,
		}
		let board_x = config.width/2-((size.width*board.width)/2)+size.width/2; //Center X
		let board_y = config.height/2-((size.height*board.height)/2)+size.height/2; //Center Y
		let array = [];
		for(let y = 0; y<board.height; y++){
			let arr_x = [];
			for(let x = 0; x<board.width; x++){
				arr_x.push(0);
				let tile = this.add.sprite(board_x+(x*size.width), board_y+(y*size.width), 'tile');
				tile.setInteractive();
				tile.pos = {
					x: x,
					y: y,
				};
				tile.tile = true;
				tiles.add(tile);
			}
			array.push(arr_x);
		}
		//
		let b_back = draw_button(config.width/2, 900, 'back', this);
		let b_sound = draw_button(165, 900, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		let b_restart = draw_button(570, 900, 'restart', this);
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(obj.button){
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function(){
						if(obj.name === 'back'){
							self.scene.start('menu');
						} else if(obj.name === 'restart' || obj.name === 'restart2'){
							self.scene.restart();
						} else if(obj.name === 'sound'){
							switch_audio(obj);
						}
					}
				}, this);
			} else if(obj.tile && state === 'play'){
				if(!array[obj.pos.y][obj.pos.x]){ //Empty spot
					fill_spot(obj.pos.x, obj.pos.y);
					change_turn();
				}
			}
		}, this);
		function change_turn(){
			if(!is_board_full()){
				let winner = who_won();
				if(winner){
					state = 'gameover';
					if(winner === 1){
						self.add.sprite(config.width/2, 200, 'txt_win');
					} else {
						self.add.sprite(config.width/2, 200, 'txt_lose');
					}
				} else {
					if(turn === 1){
						turn = 2;
						bot_turn();
					} else {
						turn = 1;
					}
				}
			} else {
				state = 'gameover';
				let winner = who_won();
				if(winner){
					if(winner === 1){
						self.add.sprite(config.width/2, 200, 'txt_win');
					} else {
						self.add.sprite(config.width/2, 200, 'txt_lose');
					}
				} else {
					self.add.sprite(config.width/2, 200, 'txt_tie');
				}
			}
		}
		function is_board_full(x, y){
			for(let y = 0; y<board.height; y++){
				for(let x = 0; x<board.width; x++){
					if(!array[y][x]){ //Empty spot
						return false;
					}
				}
			}
			return true;
		}
		function fill_spot(x, y){
			let total = tiles.getLength();
			let child = tiles.getChildren();
			for(let i=0; i<total; i++){
				let tile = child[i];
				if(tile.pos.x === x && tile.pos.y === y){
					array[tile.pos.y][tile.pos.x] = turn;
					self.add.sprite(tile.x, tile.y, 'player'+turn);
				}
			}
		}
		function bot_turn(){
			let empty_list = [];
			for(let y = 0; y<board.height; y++){
				for(let x = 0; x<board.width; x++){
					if(!array[y][x]){ //Empty spot
						empty_list.push({x:x, y:y});
					}
				}
			}
			if(empty_list.length > 0){
				let move;
				if(game_settings.difficulty === 'easy'){
					move = random_move(empty_list);
				} else {
					move = smart_move(empty_list);
				}
				fill_spot(move.x, move.y);
			}
			change_turn();
		}
		function random_move(moves){
			//Easy bot
			let rand = Math.floor(Math.random()*moves.length);
			return moves[rand];
		}
		function smart_move(moves){
			//Hard bot
			let important = [];
			let blacklist = [];
			let whitelist = [];
			for(let i=0; i<moves.length; i++){
				let move = moves[i];
				let arr = JSON.parse(JSON.stringify(array));
				arr[move.y][move.x] = turn;
				let winner = who_won(arr);
				if(winner){
					if(winner === turn){
						return move;
					} else {
						blacklist.push(move);
					}
				} else {
					let opponent = 2;
					if(turn === 2){
						opponent = 1;
					}
					arr[move.y][move.x] = opponent;
					winner = who_won(arr);
					if(winner === opponent){
						important.push(move);
					} else {
						whitelist.push(move);
					}
				}
			}
			if(important.length > 0){
				let rand = Math.floor(Math.random()*important.length);
				return important[rand];
			} else if(whitelist.length > 0){
				let rand = Math.floor(Math.random()*whitelist.length);
				return whitelist[rand];
			} else {
				return blacklist[0];
			}
		}
		function who_won(arr){
			let p1_win = is_winner(1, arr);
			let p2_win = is_winner(2, arr);
			if(p1_win || p2_win){
				if(p1_win){
					return 1;
				} else {
					return 2;
				}
			}
			return 0;
		}
		function is_winner(player, arr){
			if(!arr){
				arr = array;
			}
			//Find in row
			for(let y = 0; y<board.height; y++){
				let count = 0;
				for(let x = 0; x<board.width; x++){
					if(arr[y][x] === player){
						count++;
					} else {
						break;
					}
				}
				if(count === 3){
					return player;
				}
			}
			//Find in col
			for(let x = 0; x<board.width; x++){
				let count = 0;
				for(let y = 0; y<board.height; y++){
					if(arr[y][x] === player){
						count++;
					} else {
						break;
					}
				}
				if(count === 3){
					return player;
				}
			}
			//Find in \
			let count = 0;
			for(let i = 0; i<board.height; i++){
				if(arr[i][i] === player){
					count++;
				} else {
					break;
				}
				if(count === 3){
					return player;
				}
			}
			//Find in /
			count = 0;
			for(let i = 0; i<board.height; i++){
				if(arr[i][(board.width-1)-i] === player){
					count++;
				} else {
					//break;
				}
				if(count === 3){
					return player;
				}
			}
			return 0; //No one win
		}
	}
}
function play_sound(id, scope){
	if(game_settings.sound){
		if(document.hasFocus()){
			scope.sound.play(id);
		}
	}
}
function switch_audio(obj){
	if(game_settings[obj.name]){
		game_settings[obj.name] = false;
		obj.setTexture('btn_'+obj.name+'_off');
	} else {
		game_settings[obj.name] = true;
		obj.setTexture('btn_'+obj.name+'_on');
	}
}
function check_audio(obj){
	if(game_settings[obj.name]){
		obj.setTexture('btn_'+obj.name+'_on');
	} else {
		obj.setTexture('btn_'+obj.name+'_off');
	}
}
function draw_button(x, y, id, scope){
	let btn = scope.add.sprite(x, y, 'btn_'+id).setInteractive();
	btn.button = true;
	btn.name = id;
	return btn;
}
var config = {
	type: Phaser.WEBGL,
	width: 720,
	height: 1080,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);