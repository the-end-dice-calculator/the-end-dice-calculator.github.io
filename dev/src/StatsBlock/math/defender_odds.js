import {clone, generate_all_rolls, normalize_vector} from './utils';

const generate_defender_odds = (circumstances) => {
	const results = {
		COVER: 0,
		ARMOR: 0,
		HIT: 0
	};

	const evaluate_roll = (circumstances, roll) => {
		let die_index = 0;
		if (circumstances.cover) {
			// TODO: cover value should be able to vary (e.g. Northstar Militia)
			//       but I don't want to deal with it yet
			const cover_value = 5;
			let cover_roll = roll[die_index++];
			if (circumstances.piercing && cover_roll === cover_value) {
				circumstances = clone(circumstances, {piercing: false});
				cover_roll -= 1;
			}
			if (circumstances.scoped && cover_roll >= cover_value) {
				circumstances = clone(circumstances, {scoped: false});
				cover_roll = roll[die_index++];
			}
			if (circumstances.piercing && cover_roll >= cover_value) {
				circumstances = clone(circumstances, {piercing: false});
				cover_roll -= 1;
			}
			if (cover_roll >= cover_value) {
				return "COVER";
			}
		}
		if (circumstances.armor && circumstances.armor < 7) {
			const armor_value = circumstances.armor;
			let armor_roll = roll[die_index++];
			if (circumstances.piercing && armor_roll === armor_value) {
				circumstances = clone(circumstances, {piercing: false});
				armor_roll -= 1;
			}
			if (circumstances.scoped && armor_roll >= armor_value) {
				circumstances = clone(circumstances, {scoped: false});
				armor_roll = roll[die_index++];
			}
			if (circumstances.piercing && armor_roll >= armor_value) {
				circumstances = clone(circumstances, {piercing: false});
				armor_roll -= 1;
			}
			if (armor_roll >= armor_value) {
				return "ARMOR";
			}
		}
		//hit made it through the gauntlet of saves
		return "HIT";
	}

	// We never need more than 3 dice
	const defense_rolls = generate_all_rolls(3);
	for (let roll of defense_rolls) {
		results[evaluate_roll(circumstances, roll)] += 1;
	}
	return normalize_vector(results);
}

const generate_defender_brutal_odds = (circumstances) => {
	const results = {
		"COVER": 0, // 2 cover
		"ARMOR": 0, // 1 cover, 1 armor
		"DOUBLE_ARMOR": 0, // 2 armor
		"HIT": 0, // 1 cover, 1 hit
		"ARMOR_AND_HIT": 0, // 1 armor, 1 hit
		"DOUBLE_HIT": 0 // 2 hit
	};

	const evaluate_roll = (circumstances, roll) => {
		let die_index_1 = 0;
		let die_index_2 = 1;
		const next_index = () => Math.max(die_index_1, die_index_2) + 1;
		let saved_one_from_cover = false;
		if (circumstances.cover) {
			// TODO: cover value should be able to vary (e.g. Northstar Militia)
			//       but I don't want to deal with it yet
			const cover_value = 5;
			const cover_dice = [roll[die_index_1], roll[die_index_2]];
			die_index_1 = next_index();
			die_index_2 = next_index();
			if (circumstances.piercing && cover_dice.some(x => x === cover_value)) {
				circumstances = clone(circumstances, {piercing: false});
				const pierce_index = cover_dice.findIndex(x => x === cover_value);
				cover_dice[pierce_index] -= 1;
			}
			if (circumstances.scoped && cover_dice.some(x => x >= cover_value)) {
				circumstances = clone(circumstances, {scoped: false});
				const scoped_reroll_index =
					cover_dice.findIndex((die) => die >= cover_value);
				cover_dice[scoped_reroll_index] = roll[die_index_1];
				die_index_1 = next_index();
			}
			if (circumstances.piercing && cover_dice.some(x => x >= cover_value)) {
				circumstances = clone(circumstances, {piercing: false});
				let pierce_index = cover_dice.findIndex(x => x === cover_value);
				if (pierce_index === -1) {
					pierce_index = cover_dice.findIndex(x => x >= cover_value);
				}
				cover_dice[pierce_index] -= 1;
			}
			if (cover_dice.every((die) => die >= cover_value)) {
				return "COVER";
			} else if (cover_dice.some((die) => die >= cover_value)) {
				saved_one_from_cover = true;
			}
		}
		if (circumstances.armor && circumstances.armor < 7) {
			const armor_value = circumstances.armor;
			if (saved_one_from_cover) {
				// only one hit needs to be saved
				let armor_roll = roll[die_index_1];
				die_index_1 = next_index();
				if (circumstances.piercing && armor_roll === armor_value) {
					circumstances = clone(circumstances, {piercing: false});
					armor_roll -= 1;
				}
				if (circumstances.scoped && armor_roll >= armor_value) {
					circumstances = clone(circumstances, {scoped: false});
					armor_roll = roll[die_index_1];
					die_index_1 = next_index();
				}
				if (circumstances.piercing && armor_roll >= armor_value) {
					circumstances = clone(circumstances, {piercing: false});
					armor_roll -= 1;
				}
				if (armor_roll >= armor_value) {
					return "ARMOR";
				} else {
					return "HIT";
				}
			} else {
				const armor_dice = [roll[die_index_1], roll[die_index_2]];
				die_index_1 = next_index();
				die_index_2 = next_index();
				if (circumstances.piercing && 
					armor_dice.some(x => x === armor_value)
				) {
					circumstances = clone(circumstances, {piercing: false});
					const pierce_index = armor_dice.findIndex(x => x === armor_value);
					armor_dice[pierce_index] -= 1;
				}
				if (circumstances.scoped &&
					armor_dice.some(x => x >= armor_value)
				) {
					circumstances = clone(circumstances, {scoped: false});
					const scoped_reroll_index =
						armor_dice.findIndex((die) => die >= armor_value);
					armor_dice[scoped_reroll_index] = roll[die_index_1];
					die_index_1 = next_index();
				}
				if (circumstances.piercing && 
					armor_dice.some(x => x >= armor_value)
				) {
					circumstances = clone(circumstances, {piercing: false});
					let pierce_index = armor_dice.findIndex(x => x === armor_value);
					if (pierce_index === -1) {
						pierce_index = armor_dice.findIndex(x => x >= armor_value);
					}
					armor_dice[pierce_index] -= 1;
				}
				if (armor_dice.every((die) => die >= armor_value)) {
					return "DOUBLE_ARMOR";
				} else if (armor_dice.some((die) => die >= armor_value)) {
					return "ARMOR_AND_HIT";
				} else {
					return "DOUBLE_HIT";
				}
			}
		} else {
			// no armor save
			if (saved_one_from_cover) {
				return "HIT";
			} else {
				return "DOUBLE_HIT";
			}
		}
	}

	// We never need more than 5 dice
	const defense_rolls = generate_all_rolls(5);
	for (let roll of defense_rolls) {
		results[evaluate_roll(circumstances, roll)] += 1;
	}
	return normalize_vector(results);
}

export {generate_defender_odds, generate_defender_brutal_odds};
