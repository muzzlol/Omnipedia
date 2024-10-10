import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/Searchbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <SearchBar />
        </main>
      </div>
    </Router>
  );
};

export default App;