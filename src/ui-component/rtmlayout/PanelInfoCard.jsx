import React, { useState } from 'react';
import { Upload, Wifi, Power, Info } from 'lucide-react';

// Define styles as objects to keep the JSX clean
const styles = {
  card: {
    backgroundColor: '#FAF9F6',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '16px',
    width: '100%',
    maxWidth: '450px', // Increased width to accommodate the new layout
    color: 'white',
    fontFamily: 'Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#22D3EE' // text-cyan-400
  },
  // Main container for the two-column layout
  mainContent: {
    display: 'flex',
    gap: '16px'
  },
  // Left column for the image
  imageColumn: {
    flex: '1 1 40%', // Takes up about 40% of the space
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Right column for the details
  detailsColumn: {
    flex: '1 1 60%', // Takes up about 60% of the space
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around' // Distributes space evenly
  },
  imageUploadContainer: {
    width: '100%',
    height: '150px', // Made the upload area taller
    border: '2px dashed #4B5563',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: '#374151'
  },
  imagePreview: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    padding: '4px 0' // Added some vertical padding
  },
  statusText: {
    color: '#000000' // A lighter gray for better contrast
  },
  onOffButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    width: '100%', // Make button take full width of its container
    justifyContent: 'center'
  },
  onButton: {
    backgroundColor: '#10B981',
    color: 'white'
  },
  offButton: {
    backgroundColor: '#EF4444',
    color: 'white'
  }
};

// The component for the top-left card in your dashboard layout
// ID: DB-PIC-01
function PanelInfoCard() {
  const [isPanelOn, setIsPanelOn] = useState(true);
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.mainContent}>
        {/* Left Column */}
        <div style={styles.imageColumn}>
          <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          <label htmlFor="imageUpload" style={styles.imageUploadContainer}>
            {image ? (
              <img src={image} alt="Panel" style={styles.imagePreview} />
            ) : (
              <>
                <Upload color="#9CA3AF" size={32} />
                <span style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '8px' }}>Upload Image</span>
              </>
            )}
          </label>
        </div>

        {/* Right Column */}
        <div style={styles.detailsColumn}>
          <div style={styles.detailItem}>
            <span style={styles.statusText}>1. Panel / M/C Name</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.statusText}>2. Details-Rating</span>
          </div>
          <div style={styles.detailItem}>
            <Wifi color="#34D399" size={16} />
            <span style={styles.statusText}>3. IoT Cloud Status</span>
          </div>
          <div style={styles.detailItem}>
            <button
              style={{
                ...styles.onOffButton,
                ...(isPanelOn ? styles.onButton : styles.offButton)
              }}
              onClick={() => setIsPanelOn(!isPanelOn)}
            >
              <Power size={16} />
              {isPanelOn ? 'Panel is ON' : 'Panel is OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelInfoCard;
