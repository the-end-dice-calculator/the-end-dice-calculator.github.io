import {generate_all_rolls, normalize_vector} from './utils';

const generate_defender_odds = (circumstances) => {
	const results = {
		COVER: 0,
		ARMOR: 0,
		HIT: 0
	};
	// We never need more than 3 dice
	const defense_rolls = generate_all_rolls(3);
	// TODO: cover value should be able to vary (e.g. Northstar Militia)
	//       but I don't want to deal with it yet
	const cover_value = 5;
	for (let roll of defense_rolls) {
		let die_index = 0;
		let scoped_reroll_available = circumstances.scoped;
		if (circumstances.cover) {
			if (roll[die_index++] >= cover_value) {
				// cover save success
				if (scoped_reroll_available) {
					scoped_reroll_available = false;
					if (roll[die_index++] >= cover_value) {
						// cover reroll success
						results["COVER"] += 1;
						continue;
					}
				} else {
					results["COVER"] += 1;
					continue;
				}
			}
		}
		if (circumstances.armor && circumstances.armor < 7) {
			const armor_value = circumstances.armor +
				(circumstances.armor_penetration ? 1 : 0);
			if (roll[die_index++] >= armor_value) {
				// armor save success
				if (scoped_reroll_available) {
					scoped_reroll_available = false;
					if (roll[die_index++] >= armor_value) {
						// armor reroll success
						results["ARMOR"] += 1;
						continue;
					}
				} else {
					results["ARMOR"] += 1;
					continue;
				}
			}
		}
		//hit made it through the gauntlet of saves
		results["HIT"] += 1;
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

	// We never need more than 5 dice
	const defense_rolls = generate_all_rolls(5);
	// TODO: cover value should be able to vary (e.g. Northstar Militia)
	//       but I don't want to deal with it yet
	const cover_value = 5;

	let die_index_1;
	let die_index_2;
	const next_index = () => Math.max(die_index_1, die_index_2) + 1;

	for (let roll of defense_rolls) {
		die_index_1 = 0;
		die_index_2 = 1;
		let saved_one_from_cover = false;
		let scoped_reroll_available = circumstances.scoped;
		if (circumstances.cover) {
			const cover_dice = [roll[die_index_1], roll[die_index_2]];
			die_index_1 = next_index();
			die_index_2 = next_index();
			if (scoped_reroll_available) {
				// force reroll if any were successful
				const scoped_reroll_index =
					cover_dice.findIndex((die) => die >= cover_value);
				if (scoped_reroll_index >= 0) {
					cover_dice[scoped_reroll_index] = roll[die_index_1]
					die_index_1 = next_index();
					scoped_reroll_available = false;
				}
			}
			if (cover_dice.every((die) => die >= cover_value)) {
				results["COVER"] += 1;
				continue;
			} else if (cover_dice.some((die) => die >= cover_value)) {
				saved_one_from_cover = true;
			}
		}
		if (circumstances.armor && circumstances.armor < 7) {
			const armor_value = circumstances.armor +
				(circumstances.armor_penetration ? 1 : 0);
			if (saved_one_from_cover) {
				// only one hit needs to be saved
				let armor_roll = roll[die_index_1];
				die_index_1 = next_index();
				if (scoped_reroll_available && armor_roll >= armor_value) {
					armor_roll = roll[die_index_1];
					die_index_1 = next_index();
				}
				if (armor_roll >= armor_value) {
					results["ARMOR"] += 1;
					continue;
				} else {
					results["HIT"] += 1;
					continue;
				}
			} else {
				const armor_dice = [roll[die_index_1], roll[die_index_2]];
				die_index_1 = next_index();
				die_index_2 = next_index();
				if (scoped_reroll_available) {
					const scoped_reroll_index =
						armor_dice.findIndex((die) => die >= armor_value);
					if (scoped_reroll_index >= 0) {
						armor_dice[scoped_reroll_index] = roll[die_index_1]
						die_index_1 = next_index();
						scoped_reroll_available = false;
					}
				}
				if (armor_dice.every((die) => die >= armor_value)) {
					results["DOUBLE_ARMOR"] += 1;
					continue;
				} else if (armor_dice.some((die) => die >= armor_value)) {
					results["ARMOR_AND_HIT"] += 1;
					continue;
				} else {
					results["DOUBLE_HIT"] += 1;
					continue;
				}
			}
		} else {
			// no armor save
			if (saved_one_from_cover) {
				results["HIT"] += 1;
			} else {
				results["DOUBLE_HIT"] += 1;
			}
		}
	}
	return normalize_vector(results);
}

export {generate_defender_odds, generate_defender_brutal_odds};
