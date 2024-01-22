class Circumstances {
	constructor({
		/*weapon properties*/
		armor_penetration = false,
		brutal = false,
		precise = false,
		rapid_fire = false,
		scoped = false,
		/*attacker circumstances*/
		injuries = 0,
		long_shot = false,
		moving = false,
		/*defender circumstances*/
		armor = 4,
		cover = false,
		target_running = false
	} = {}) { 
		this.armor_penetration = armor_penetration;
		this.brutal = brutal;
		this.precise = precise;
		this.rapid_fire = rapid_fire;
		this.scoped = scoped;
		this.injuries = injuries;
		this.long_shot = long_shot;
		this.moving = moving;
		this.armor = armor;
		this.cover = cover;
		this.target_running = target_running;
	}

	copy({
		armor_penetration = null,
		brutal = null,
		precise = null,
		rapid_fire = null,
		scoped = null,
		injuries = null,
		long_shot = null,
		moving = null,
		armor = null,
		cover = null,
		target_running = null,
	} = {}) {
		return new Circumstances({
			armor_penetration: armor_penetration ?? this.armor_penetration,
			brutal: brutal ?? this.brutal,
			precise: precise ?? this.precise,
			rapid_fire: rapid_fire ?? this.rapid_fire,
			scoped: scoped ?? this.scoped,
			injuries: injuries ?? this.injuries,
			long_shot: long_shot ?? this.long_shot,
			moving: moving ?? this.moving,
			armor: armor ?? this.armor,
			cover: cover ?? this.cover,
			target_running: target_running ?? this.target_running
		});
	}

	get_attack_dice() {
		return 1 + this.injuries +
			(this.long_shot ? 1 : 0) +
			(this.moving? 1 : 0) +
			(this.cover ? 1 : 0) +
			(this.target_running? 1 : 0);
	}
}

const DEFAULT_CIRCUMSTANCES = new Circumstances();

export { DEFAULT_CIRCUMSTANCES };
