class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		let self = this;
		let bg = this.add.sprite(config.width/2, config.height/2, 'bg_game');
		let title = this.add.sprite(config.width/2, 320, 'game_title');
		let b_easy = draw_button(config.width/2, 500, 'easy', this);
		let b_hard = draw_button(config.width/2, 600, 'hard', this);
		let info = this.add.sprite(config.width/2, 920, 'info');
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
						if(obj.name === 'easy'){
							game_settings.difficulty = 'easy';
							self.scene.start('game');
						} else if(obj.name === 'hard'){
							game_settings.difficulty = 'hard';
							self.scene.start('game');
						}
					}
				}, this);
			}
		}, this);
	}
}