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
    backgroundColor: '#f7f7f7', // Light background for contrast
  },
  card: {
    textAlign: 'center' as const, // Ensures all content inside the card is centered
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px', // Rounded corners for the card
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333', // Darker color for the title text
  },
  message: {
    fontSize: '16px',
    color: '#555', // Medium gray for better readability
    marginBottom: '1rem',
  },
  subMessage: {
    fontSize: '14px',
    color: '#777', // Lighter gray for secondary text
  },
};

export default ThankYouPage;