import {calculate_odds} from './math/calculate_odds';

onmessage = function(event)  {
	console.log("Beginning calculation...");
	console.log(event.data);
	const start_time = Date.now();
	const odds = calculate_odds(event.data);
	const end_time = Date.now();
	console.log(`Finished calculation in ${end_time - start_time}ms`);
	postMessage(odds);
}
