import logo from './logo.svg';
import './App.css';
import Graph from './components/Graph';

function App() {
  return (
    <div className="App">
        <Graph x1={-50} x2={50} y1={-50} y2={50} ></Graph>
    </div>
  );
}

export default App;
