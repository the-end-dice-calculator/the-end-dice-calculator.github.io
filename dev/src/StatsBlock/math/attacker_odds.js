import {clone, generate_all_rolls, normalize_vector} from './utils';

// TODO: maybe move these into an array utils file?
// probably going to use them again
const count = (arr, el) => arr.map((x) => x === el).filter(Boolean).length;
const indicesOf = (arr, el) =>
	arr.map((x, i) => x === el ? i : null).filter((i) => i != null);

const get_attack_dice = (circumstances) => 
	1 + circumstances.injuries +
		(circumstances.long_shot ? 1 : 0) +
		(circumstances.moving? 1 : 0) +
		(circumstances.cover ? 1 : 0) +
		(circumstances.target_running? 1 : 0);

function* get_reroll_possibilities (roll, reroll_indices) {
	const rerolls = generate_all_rolls(reroll_indices.length);
	for (let reroll of rerolls) {
		yield roll.map((x,i) =>
			reroll_indices.includes(i) ? reroll[reroll_indices.indexOf(i)] : x)
	}
}

const get_brutal_reroll_index = (roll, rerolls_used) => {
	const one_indices = indicesOf(roll, 1);
	const two_indices = indicesOf(roll, 2);
	for (let index of one_indices.concat(two_indices)) {
		if (!rerolls_used.includes(index)) {
			return index;
		}
	}
	return -1;
}

const get_attack_outcome = (roll, is_brutal) => {
	if (Math.min(...roll) < 3) {
		return "MISS";
	} else if (Math.min(...roll) < 6) {
		return is_brutal ? "BRUTAL_HIT" : "HIT";
	} else {
		return is_brutal ? "BRUTAL_CRIT" : "CRIT";
	}
}

const generate_attacker_odds = (circumstances) => {
	const outcomes = {
		BRUTAL_CRIT: 0,
		CRIT: 0,
		BRUTAL_HIT: 0,
		HIT: 0,
		MISS: 0
	}

	const evaluate_roll = (circumstances, roll, rerolls_used=[], weight=1) => {
		if (circumstances.rapid_fire) {
			const reroll_indices =
				indicesOf(roll, 1).filter((i) => !rerolls_used.includes(i));
			if (reroll_indices.length) {
				const weight_factor = 1 / (6 ** reroll_indices.length);
				for (let reroll of get_reroll_possibilities(roll, reroll_indices)) {
					evaluate_roll(
						clone(circumstances, {rapid_fire: false}),
						reroll,
						rerolls_used.concat(reroll_indices),
						weight * weight_factor
					);
				}
				return;
			}
		}
		if (circumstances.precise && count(roll, 2) === 1 && count(roll, 1) === 0) {
			circumstances = clone(circumstances, {precise: false});
			roll[roll.indexOf(2)] += 1;
		}
		if (circumstances.brutal && (roll.includes(1) || roll.includes(2))) {
			const reroll_index = get_brutal_reroll_index(roll, rerolls_used);
			if (reroll_index >= 0) {
				[1,2,3,4,5,6].forEach((n) => {
					const reroll = roll.map((x,i) => i === reroll_index? n : x);
					evaluate_roll(
						clone(circumstances, {brutal: false}),
						reroll,
						rerolls_used.concat(reroll_index),
						weight /6
					);
				});
				return;
			}
		}
		if (circumstances.precise) {
			circumstances = clone(circumstances, {precise: false});
			roll[roll.indexOf(Math.min(...roll))] += 1;
		}
		const outcome = get_attack_outcome(roll,
			circumstances.brutal && rerolls_used.length === 0);
		outcomes[outcome] += weight;
	}

	for (let roll of generate_all_rolls(get_attack_dice(circumstances))) {
		evaluate_roll(circumstances, roll);
	}
	return normalize_vector(outcomes);
}

export {generate_attacker_odds};
