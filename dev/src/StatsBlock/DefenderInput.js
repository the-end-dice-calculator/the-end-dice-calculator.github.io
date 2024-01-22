const DefenderInput = ({circumstances, onChange}) => {
	const onArmorChanged = (e) => {
		onChange(circumstances.copy({"armor": +(e.target.value)}));
	}

	const onBoxChanged = (property) => (e) => {
		onChange(circumstances.copy({[property]: e.target.checked}));
	}

	return (
		<div>
			<h2>Defender</h2>
			<div>
				<label>Armor</label>
				<select
					onChange={onArmorChanged}
					value={circumstances.armor}>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">None</option>
				</select>
			</div>
			<div>
				<input
					type="checkbox"
					onChange={onBoxChanged("cover")}
					checked={circumstances.cover}
				/>
				<label>Cover</label>
			</div>
			<div>
				<input
					type="checkbox"
					onChange={onBoxChanged("target_running")}
					checked={circumstances.target_running}
				/>
				<label>Target running</label>
			</div>
		</div>
	);
}

export default DefenderInput;
