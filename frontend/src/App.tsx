import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/pages/LoginPage';
import { RegisterForm } from '@/pages/RegisterPage';
import { Home } from '@/pages/Home';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TopicPage } from '@/pages/TopicPage'; // Import the new TopicPage component

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto mt-8 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/topics/:name" element={<TopicPage />} /> {/* Updated route */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<div>Profile Page</div>} />
                {/* Future protected routes can be added here */}
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
