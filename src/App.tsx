import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TimerProvider } from './hooks/useSingleTimer';
import { ProtocolProvider } from './hooks/useProtocol';
import { SettingsProvider } from './hooks/useSettings';
import { DataProvider } from './hooks/useData';
import { HomeScreen } from './features/home/HomeScreen';
import { PauseSelectionScreen } from './features/pause/PauseSelectionScreen';
import { PauseDetailScreen } from './features/pause/PauseDetailScreen';
import { CommunicateScreen } from './features/communicate/CommunicateScreen';
import { CommunicateEditScreen } from './features/communicate/CommunicateEditScreen';
import { RoutineScreen } from './features/routine/RoutineScreen';
import { RoutineEditScreen } from './features/routine/RoutineEditScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';

export default function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <TimerProvider>
          <ProtocolProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/pause" element={<PauseSelectionScreen />} />
                <Route path="/pause/detail" element={<PauseDetailScreen />} />
                <Route path="/communicate" element={<CommunicateScreen />} />
                <Route path="/communicate/edit" element={<CommunicateEditScreen />} />
                <Route path="/routine" element={<RoutineScreen />} />
                <Route path="/routine/edit" element={<RoutineEditScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
              </Routes>
            </Router>
          </ProtocolProvider>
        </TimerProvider>
      </DataProvider>
    </SettingsProvider>
  );
}
