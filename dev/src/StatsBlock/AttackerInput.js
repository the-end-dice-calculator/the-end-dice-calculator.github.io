const AttackerInput = ({circumstances, onChange}) => {

	const onInjuriesChanged = (e) => {
		onChange(circumstances.copy({"injuries": +(e.target.value)}));
	}

	const onBoxChanged = (property) => (e) => {
		onChange(circumstances.copy({[property]: e.target.checked}));
	}

	return (
		<div className="AttackerInput">
			<h2>Attacker</h2>
			<h4>Weapon</h4>
			<div className="AttackerInput-block">
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("armor_penetration")}
						checked={circumstances.armor_penetration}
					/>
					<label>Armor penetration</label>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("brutal")}
						checked={circumstances.brutal}
					/>
					<label>Brutal</label>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("precise")}
						checked={circumstances.precise}
					/>
					<label>Precise</label>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("rapid_fire")}
						checked={circumstances.rapid_fire}
					/>
					<label>Rapid-fire</label>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("scoped")}
						checked={circumstances.scoped}
					/>
					<label>Scoped</label>
				</div>
			</div>
			<h4>Circumstances</h4>
			<div className="AttackerInput-block">
				<div>
					<label>Injuries</label>
					<select
						onChange={onInjuriesChanged}
						value={circumstances.injuries}
					>
						<option value="0">None</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
					</select>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("long_shot")}
						checked={circumstances.long_shot}
					/>
					<label>Long shot</label>
				</div>
				<div>
					<input
						type="checkbox"
						onChange={onBoxChanged("moving")}
						checked={circumstances.moving}
					/>
					<label>Moving</label>
				</div>
			</div>
		</div>
	);
}

export default AttackerInput;
