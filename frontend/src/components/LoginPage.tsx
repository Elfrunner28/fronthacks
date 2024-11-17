import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoginPageProps = {
  onLogin: (userId: string) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const fakeUserId = `user-${Math.random().toString(36).substr(2, 9)}`; // Generate a fake user ID
    onLogin(fakeUserId); // Pass the fake ID
    navigate('/'); // Redirect to the map page
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <button onClick={handleLogin} style={styles.button}>
          Proceed to Map
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
  },
  card: {
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '24px',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default LoginPage;