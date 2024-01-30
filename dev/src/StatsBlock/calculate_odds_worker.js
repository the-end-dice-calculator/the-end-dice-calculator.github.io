import {calculate_odds} from './math/calculate_odds';

onmessage = function(event)  {
	const odds = calculate_odds(event.data.circumstances);
	postMessage({
		requestTime: event.data.requestTime,
		output: odds
	});
}
