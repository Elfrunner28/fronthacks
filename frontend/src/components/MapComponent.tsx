import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api';

type Location = { lat: number; lng: number };

type MapComponentProps = {
  username: string; // Prop type for username
  userId: number;
};

const libraries: Libraries = ['places'];
const MapComponent: React.FC<MapComponentProps> = ({ username, userId }) => {
  const navigate = useNavigate(); // React Router's navigation hook

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const settingPickup = useRef(true);

  useEffect(() => {
    setPickup(null);
    setDropoff(null);
    setHasSubmitted(false);
    setMessage(null);
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (hasSubmitted) {
      setMessage('You have already submitted your locations. You cannot submit more.');
      return;
    }

    const location = event.latLng?.toJSON();
    if (location) {
      if (settingPickup.current) {
        setPickup(location);
        setMessage('Pickup location set. Now select the dropoff location.');
      } else {
        setDropoff(location);
        setMessage('Dropoff location set. Click submit to finalize.');
      }
      settingPickup.current = !settingPickup.current;
    }
  };

  const handleSubmit = async () => {
    if (hasSubmitted) {
      setMessage('You have already submitted your locations. You cannot submit more.');
      return;
    }

    if (!pickup || !dropoff) {
      setMessage('Please set both pickup and dropoff locations before submitting.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          latitude1: pickup.lat,
          longitude1: pickup.lng,
          latitude2: dropoff.lat,
          longitude2: dropoff.lng,
        }),
      });

      const result = await response.json();
      console.log('Backend Response:', result);

      if (response.ok) {
        setHasSubmitted(true);
        navigate('/thank-you'); // Redirect to "Thank You" page
      } else {
        setMessage(result.message || 'Failed to submit locations.');
      }
    } catch (error) {
      console.error('Error submitting locations:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const memphisBounds = {
    north: 35.4000,
    south: 34.8500,
    west: -90.3000,
    east: -89.6000,
  };

  if (loadError) return <div>Error loading maps. Please refresh the page.</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Welcome, {username}! Enter your route requests</h2>
      <GoogleMap
        mapContainerStyle={styles.mapContainer}
        center={{ lat: 35.1175, lng: -89.9711 }}
        zoom={12}
        onClick={handleMapClick}
        options={{
          restriction: {
            latLngBounds: memphisBounds,
            strictBounds: false,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {pickup && <Marker position={pickup} title="Pickup Location" />}
        {dropoff && <Marker position={dropoff} title="Dropoff Location" />}
      </GoogleMap>
      <div style={styles.controls}>
        <button
          onClick={handleSubmit}
          disabled={hasSubmitted}
          style={hasSubmitted ? styles.disabledButton : styles.submitButton}
        >
          Submit
        </button>
        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
    padding: '0',
  },
  header: {
    marginBottom: '1rem',
    fontSize: '24px',
    color: '#333',
  },
  mapContainer: {
    width: '100%',
    height: '75vh',
  },
  controls: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  disabledButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'gray',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#f0f4f8',
    color: '#333',
    textAlign: 'center' as const,
    width: '90%',
  },
};

export default MapComponent;