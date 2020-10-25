class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		let bg = this.add.sprite(config.width/2, config.height/2, 'bg_game');
		let title = this.add.sprite(config.width/2, 320, 'game_title');
		this.load.image('btn_back', 'img/btn_back.png');
		this.load.image('btn_easy', 'img/btn_easy.png');
		this.load.image('btn_hard', 'img/btn_hard.png');
		this.load.image('player1', 'img/player1.png');
		this.load.image('player2', 'img/player2.png');
		this.load.image('tile', 'img/tile.png');
		this.load.image('txt_win', 'img/txt_win.png');
		this.load.image('txt_lose', 'img/txt_lose.png');
		this.load.image('txt_tie', 'img/txt_tie.png');
		this.load.image('info', 'img/info.png');
		this.load.image('popup', 'img/popup.png');
		this.load.image('btn_sound_on', 'img/btn_sound_on.png');
		this.load.image('btn_sound_off', 'img/btn_sound_off.png');
		this.load.image('btn_restart', 'img/btn_restart.png');
		this.load.image('btn_restart2', 'img/btn_restart2.png');
		this.load.image('tile', 'img/tile.png');
		this.load.image('tile', 'img/tile.png');
	}
	create(){
		let self = this;
		let b_start = draw_button(config.width/2, 500, 'start', this);
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
						if(obj.name === 'start'){
							self.scene.start('menu');
						}
					}
				}, this);
			}
		}, this);
	}
}