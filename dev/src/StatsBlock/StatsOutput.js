import {useState, useEffect} from 'react';

// Keep track of the latest request time so we don't post
// data from outdated calculations.
let latestRequestTime = null;

const StatsOutput = ({circumstances}) => {
	const [isCalculating, setIsCalculating] = useState(false);
	const [showBrutal, setShowBrutal] = useState(false);
	const [outputData, setOutputData] = useState(null);
	const [worker, setWorker] = useState(null);
	const [isButtonActive, setIsButtonActive] = useState(true);

	useEffect(() => {
		if (circumstances) {
			setIsButtonActive(true);
			setIsCalculating(false);
			setOutputData(null);
			latestRequestTime = null;
		}
	}, [circumstances, setIsButtonActive]);

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
		if (outputData.requestTime === latestRequestTime) {
			setOutputData(outputData.output);
			setIsCalculating(false);
		}
	}

	const calculate = () => {
		if (circumstances) {
			setShowBrutal(circumstances.brutal);
			setIsCalculating(true);
			setIsButtonActive(false);
			setOutputData(null);
			latestRequestTime = Date.now();
			worker.postMessage({
				circumstances,
				requestTime: latestRequestTime
			});
		}
	}

	const format_percent = (x) => {
		if (x === 0) {
			return '0%';
		} else if ( x < 0.001) {
			return '<0.1%';
		} else {
			return `${(x * 100.0).toFixed(1)}%`;
		}
	}

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
			{isButtonActive && <button onClick={calculate}>Calculate</button>}
			{isCalculating && <button className="running">Calculating...</button>}
			{!isCalculating && outputData != null && (
				<table>
					<tbody>
						{output_keys.map(([key, label]) => (
							<tr key={key}>
								<td>{label}</td>
								<td className="percent-output">
									{format_percent(outputData[key])}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default StatsOutput;
