import {useState, useEffect} from 'react';

const StatsOutput = ({circumstances}) => {
	const [isCalculating, setIsCalculating] = useState(false);
	const [showBrutal, setShowBrutal] = useState(false);
	const [outputData, setOutputData] = useState(null);
	const [worker, setWorker] = useState(null);

	useEffect(() => {
		const calculateWorker = new Worker(
			new URL("./calculate_odds_worker.js", import.meta.url));
		calculateWorker.onmessage = function (event) {
			onReceiveOutput(event.data);
		}
		setWorker(calculateWorker);
		return () => {
			calculateWorker.terminate();
		};
	}, []);

	const onReceiveOutput = (outputData) => {
		setOutputData(outputData);
		setIsCalculating(false);
	}

	const calculate = () => {
		if (circumstances) {
			setShowBrutal(circumstances.brutal);
			setIsCalculating(true);
			setOutputData(null);
			worker.postMessage(circumstances);
		}
	}

	const format_percent = (x) => `${(x * 100.0).toFixed(1)}%`;

	const BRUTAL_OUTPUT_KEYS = [
		["KILL", "Kill"],
		["BRUTAL_HIT", "Double hit to body"],
		["HIT_AND_ARMOR_BREAK", "Hit to body and armor"],
		["HIT", "Hit"],
		["DOUBLE_ARMOR_BREAK", "Double hit to armor"],
		["ARMOR_BREAK", "Hit to armor"],
		["MISS", "Miss"]
	];

	const NORMAL_OUTPUT_KEYS = [
		["KILL", "Kill"],
		["HIT", "Hit"],
		["ARMOR_BREAK", "Hit to armor"],
		["MISS", "Miss"]
	]

	const output_keys = showBrutal ? BRUTAL_OUTPUT_KEYS : NORMAL_OUTPUT_KEYS;

	return (
		<div className="StatsOutput">
			<button onClick={calculate}>Calculate</button>
			<div>{isCalculating && "Calculating..."}</div>
			{!isCalculating && outputData != null && (
				<table>
					<tbody>
						{output_keys.map(([key, label]) => (
							<tr key={key}>
								<td>{label}</td>
								<td>{format_percent(outputData[key])}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default StatsOutput;
