class Circumstances {
	constructor({
		/*weapon properties*/
		brutal = false,
		piercing = false,
		precise = false,
		rapid_fire = false,
		scoped = false,
		/*attacker circumstances*/
		injuries = 0,
		long_shot = false,
		moving = false,
		/*defender circumstances*/
		armor = 5,
		cover_penalty = false,
		cover_save = false,
		target_running = false
	} = {}) { 
		this.brutal = brutal;
		this.piercing = piercing;
		this.precise = precise;
		this.rapid_fire = rapid_fire;
		this.scoped = scoped;
		this.injuries = injuries;
		this.long_shot = long_shot;
		this.moving = moving;
		this.armor = armor;
		this.cover_penalty = cover_penalty;
		this.cover_save = cover_save;
		this.target_running = target_running;
	}

	copy({
		brutal = null,
		piercing = null,
		precise = null,
		rapid_fire = null,
		scoped = null,
		injuries = null,
		long_shot = null,
		moving = null,
		armor = null,
		cover_penalty = null,
		cover_save = null,
		target_running = null,
	} = {}) {
		return new Circumstances({
			brutal: brutal ?? this.brutal,
			piercing: piercing ?? this.piercing,
			precise: precise ?? this.precise,
			rapid_fire: rapid_fire ?? this.rapid_fire,
			scoped: scoped ?? this.scoped,
			injuries: injuries ?? this.injuries,
			long_shot: long_shot ?? this.long_shot,
			moving: moving ?? this.moving,
			armor: armor ?? this.armor,
			cover_penalty: cover_penalty ?? this.cover_penalty,
			cover_save: cover_save ?? this.cover_save,
			target_running: target_running ?? this.target_running
		});
	}

	get_attack_dice() {
		return 1 + this.injuries +
			(this.long_shot ? 1 : 0) +
			(this.moving? 1 : 0) +
			(this.cover_penalty ? 1 : 0) +
			(this.target_running? 1 : 0);
	}
}

const DEFAULT_CIRCUMSTANCES = new Circumstances();

export { DEFAULT_CIRCUMSTANCES };
