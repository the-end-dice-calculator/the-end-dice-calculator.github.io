import {useState} from 'react';
import { DEFAULT_CIRCUMSTANCES } from './circumstances';
import AttackerInput from './AttackerInput';
import DefenderInput from './DefenderInput';
import StatsOutput from './StatsOutput';

import './StatsBlock.css';

const StatsBlock = () => {
	const [circumstances, setCircumstances] = useState(DEFAULT_CIRCUMSTANCES);

	return (
		<div className="StatsBlock">
			<div className="StatsBlock-input">
				<AttackerInput
					circumstances={circumstances}
					onChange={setCircumstances}
				/>
				<DefenderInput
					circumstances={circumstances}
					onChange={setCircumstances}
				/>
			</div>
			<div className="StatsBlock-output">
				<StatsOutput
					circumstances={circumstances}
				/>
			</div>
		</div>
	);
}

export default StatsBlock;
