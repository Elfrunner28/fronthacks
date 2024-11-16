import React from 'react';

const ThankYouPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Thank You!</h1>
        <p style={styles.message}>We appreciate your input.</p>
        <p style={styles.subMessage}>You can safely close this tab now.</p>
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
    textAlign: 'center' as const,
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '1rem',
  },
  subMessage: {
    fontSize: '14px',
    color: '#777',
  },
};

export default ThankYouPage;