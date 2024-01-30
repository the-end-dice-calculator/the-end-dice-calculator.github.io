import './App.css';
import StatsBlock from './StatsBlock/StatsBlock';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>The E.N.D. Dice Stats</h1>
				<h3>
					Dice statistics calculator
					for <a href="https://www.theendtabletop.com/">The E.N.D.</a>
				</h3>
			</header>
			<StatsBlock />
		</div>
	);
}

export default App;
