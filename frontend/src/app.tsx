import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
    setLoggedInUserId(userId); // Save user ID
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setLoggedInUserId(null); // Clear user ID
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <MapComponent username={username || ''} userId={loggedInUserId || 0} />
          ) : (
            <LoginPage onLogin={login} />
          )
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage onLogin={login} />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
};

export default App;