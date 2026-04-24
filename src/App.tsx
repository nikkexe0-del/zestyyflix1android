import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen';
import { WatchScreen } from './pages/WatchScreen';
import { CategoryScreen } from './pages/CategoryScreen';
import { CreditsScreen } from './pages/CreditsScreen';

export default function App() {
  return (
    <Router>
      <div className="app w-full min-h-screen bg-netflix-black">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/watch/:type/:id" element={<WatchScreen />} />
          <Route path="/category" element={<CategoryScreen />} />
          <Route path="/credits" element={<CreditsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}
