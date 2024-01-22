const clone = (obj, overrides={}) => ({
	...obj,
	...overrides
});

function* generate_all_rolls(n) {
	const baseline = [[1],[2],[3],[4],[5],[6]];
	if (n <= 0) {
		return [];
	} else if (n === 1) {
		yield* baseline;
	} else {
		for (let roll of generate_all_rolls(n - 1)) {
			yield* baseline.map(new_roll => new_roll.concat(roll))
		}
	}
}


const powers_of_six =
	[6**0, 6**1, 6**2, 6**3, 6**4, 6**5, 6**6, 6**7, 6**8, 6**9, 6**10];
const vector_sanity_check = (denom, v) => {
	const is_close = (x,y) => Math.abs(x - y) < 0.1;
	for (let power of powers_of_six) {
		if (is_close(denom, power)) {
			return;
		}
	}
	console.error(`Sanity check failed, normalize denom is ${denom}. Expected a power of six between 1 and 6^10.`);
	console.error(v);
}

const normalize_vector = (v) => {
	const denom = Object.values(v).reduce((x,y) => x + y, 0);
	vector_sanity_check(denom, v);
	const normalized = Object.fromEntries(
		Object.entries(v).map(([key, value]) => [key, value / denom])
	);
	return normalized;
}

export {clone, generate_all_rolls, normalize_vector}
