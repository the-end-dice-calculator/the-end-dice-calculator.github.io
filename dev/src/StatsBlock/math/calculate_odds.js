import {generate_attacker_odds} from './attacker_odds';
import {clone} from './utils';
import {
	generate_defender_odds,
	generate_defender_brutal_odds
} from './defender_odds';

const combine_odds = (attack, defense, crit_defense) => {
	return {
		KILL: attack["CRIT"] * crit_defense["HIT"],
		HIT: attack["HIT"] * defense["HIT"],
		ARMOR_BREAK:
			attack["HIT"] * defense["ARMOR"] +
			attack["CRIT"] * crit_defense["ARMOR"],
		MISS: attack["MISS"] + attack["HIT"] * defense["COVER"]
	}
}

const combine_brutal_odds = (
	attack,
	defense,
	crit_defense,
	brutal_defense,
	crit_brutal_defense
) => {
	return {
		KILL:
			attack["BRUTAL_CRIT"] * crit_brutal_defense["DOUBLE_HIT"] +
			attack["BRUTAL_CRIT"] * crit_brutal_defense["ARMOR_AND_HIT"] +
			attack["CRIT"] * crit_defense["HIT"],
		BRUTAL_HIT: attack["BRUTAL_HIT"] * brutal_defense["DOUBLE_HIT"],
		HIT:
			attack["HIT"] * defense["HIT"] +
			attack["BRUTAL_HIT"] * brutal_defense["HIT"],
		HIT_AND_ARMOR_BREAK: attack["BRUTAL_HIT"] * brutal_defense["ARMOR_AND_HIT"],
		ARMOR_BREAK:
			attack["HIT"] * defense["ARMOR"] +
			attack["CRIT"] * crit_defense["ARMOR"] +
			attack["BRUTAL_HIT"] * brutal_defense["ARMOR"],
		DOUBLE_ARMOR_BREAK:
			attack["BRUTAL_HIT"] * brutal_defense["DOUBLE_ARMOR"] +
			attack["BRUTAL_CRIT"] * crit_brutal_defense["DOUBLE_ARMOR"],
		MISS:
			attack["MISS"] +
			attack["HIT"] * defense["COVER"] +
			attack["BRUTAL_HIT"] * brutal_defense["COVER"]
	};

}

const calculate_brutal_odds = (circumstances) => {
	const attacker_odds = generate_attacker_odds(circumstances);
	const defender_odds = generate_defender_odds(circumstances);
	const defender_crit_odds = circumstances.cover ?
		generate_defender_odds(clone(circumstances, {cover: false})) :
		defender_odds;
	const defender_brutal_odds = generate_defender_brutal_odds(circumstances);
	const defender_brutal_crit_odds = circumstances.cover ?
		generate_defender_brutal_odds(clone(circumstances, {cover: false})) :
		defender_brutal_odds;
	return combine_brutal_odds(
		attacker_odds,
		defender_odds,
		defender_crit_odds,
		defender_brutal_odds,
		defender_brutal_crit_odds
	);
}

const calculate_normal_odds = (circumstances) => {
	const attacker_odds = generate_attacker_odds(circumstances);
	const defender_odds = generate_defender_odds(circumstances);
	const defender_crit_odds = circumstances.cover ?
		generate_defender_odds(clone(circumstances, {cover: false})) :
		defender_odds;
	return combine_odds(
		attacker_odds,
		defender_odds,
		defender_crit_odds,
	);
}

const calculate_odds = (circumstances) => {
	if (circumstances.brutal) {
		return calculate_brutal_odds(circumstances);	
	} else {
		return calculate_normal_odds(circumstances);
	}
}

export {calculate_odds};
