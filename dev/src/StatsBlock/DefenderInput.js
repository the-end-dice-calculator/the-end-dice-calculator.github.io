const DefenderInput = ({circumstances, onChange}) => {
	const onArmorChanged = (e) => {
		onChange(circumstances.copy({"armor": +(e.target.value)}));
	}

	const onBoxChanged = (property) => (e) => {
		onChange(circumstances.copy({[property]: e.target.checked}));
	}

	const onCoverChanged = (e) => {
		onChange(circumstances.copy({
			cover_penalty: e.target.checked,
			cover_save: e.target.checked
		}));
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
					onChange={onCoverChanged}
					checked={circumstances.cover_penalty && circumstances.cover_save}
				/>
				<label>Cover</label>
			</div>
			<div className="indent">
				<input
					type="checkbox"
					onChange={onBoxChanged("cover_penalty")}
					checked={circumstances.cover_penalty}
				/>
				<label>Cover (Penalty)</label>
			</div>
			<div className="indent">
				<input
					type="checkbox"
					onChange={onBoxChanged("cover_save")}
					checked={circumstances.cover_save}
				/>
				<label>Cover (Save)</label>
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
