import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/pages/LoginPage';
import { RegisterForm } from '@/pages/RegisterPage';
import { Home } from '@/pages/Home';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TopicPage } from '@/pages/TopicPage';
import ProfilePage from '@/pages/ProfilePage'; // Import ProfilePage
import { Toaster } from '@/components/ui/toaster'; 

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
              <Route path="/topics/:slug" element={<TopicPage />} /> {/* Updated to use :slug */}
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} /> {/* Personal Profile */}
                <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Public Profile */}
              </Route>
            </Routes>
          </main>
          <Toaster /> 
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
