import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate for redirection
import LoginPage from './components/LoginPage';
import MapComponent from './components/MapComponent';
import ThankYouPage from './components/ThankYouPage';
import RegisterPage from './components/RegisterPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = React.useState<number | null>(null);

  const login = (username: string, userId: number) => {
    setIsLoggedIn(true);
    setUsername(username);
    setLoggedInUserId(userId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setLoggedInUserId(null);
  };

  // Protected Route Component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isLoggedIn ? (
      <>{children}</> // Render children if logged in
    ) : (
      <Navigate to="/login" /> // Redirect to login if not authenticated
    );
  };

  return (
    <Routes>
      {/* Home/Map Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MapComponent username={username || ''} userId={loggedInUserId || 0} />
          </ProtectedRoute>
        }
      />

      {/* Login Route */}
      <Route path="/login" element={<LoginPage onLogin={login} />} />

      {/* Register Route */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Thank You Route */}
      <Route
        path="/thank-you"
        element={
          isLoggedIn ? (
            <ThankYouPage />
          ) : (
            <Navigate to="/login" /> // Protect the Thank You page
          )
        }
      />

      {/* Catch-All Redirect to Login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;