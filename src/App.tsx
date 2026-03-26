import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './features/home/HomeScreen';
import PauseScreen from './features/pause/PauseScreen';
import PauseDetailScreen from './features/pause/PauseDetailScreen';
import CommunicateScreen from './features/communicate/CommunicateScreen';
import RoutineScreen from './features/routine/RoutineScreen';
import LibraryScreen from './features/library/LibraryScreen';
import PaywallScreen from './features/paywall/PaywallScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/pause" element={<PauseScreen />} />
        <Route path="/pause/:state" element={<PauseDetailScreen />} />
        <Route path="/communicate" element={<CommunicateScreen />} />
        <Route path="/routine" element={<RoutineScreen />} />
        <Route path="/library" element={<LibraryScreen />} />
        <Route path="/paywall" element={<PaywallScreen />} />
      </Routes>
    </Router>
  );
}
