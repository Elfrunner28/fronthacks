import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MapComponent from './components/MapComponent';
import ThankYouPage from './components/ThankYouPage';
import RegisterPage from './components/RegisterPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true); // Always logged in
  const [loggedInUserId, setLoggedInUserId] = React.useState<string | null>(null);

  const login = (userId: string) => {
    setIsLoggedIn(true);
    setLoggedInUserId(userId);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MapComponent userId={loggedInUserId || 'default-user'} />
        }
      />
      <Route path="/login" element={<LoginPage onLogin={login} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;