import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import TestingPage from './pages/testing';

function App() {
  const [showTesting, setShowTesting] = useState(false);

  return (
    <div>
      <nav className="bg-gray-800 text-white p-2 flex gap-4">
        <button
          onClick={() => setShowTesting(false)}
          className="px-3 py-1 rounded hover:bg-gray-700"
        >
          Dashboard
        </button>
        <button
          onClick={() => setShowTesting(true)}
          className="px-3 py-1 rounded hover:bg-gray-700"
        >
          Testing API
        </button>
      </nav>
      {showTesting ? <TestingPage /> : <Dashboard />}
    </div>
  );
}

export default App;