import './App.css';
import { FaithfulHistogramKDE } from './faithful/faithful_Histogram_KDE';
import { GunDeath } from './gundeath/gundeath';

function App() {
  return (
    <div className="App">
      <FaithfulHistogramKDE />
      <GunDeath />
    </div>
  );
}

export default App;
