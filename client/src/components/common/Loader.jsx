import React from 'react';

const Loader = ({ type = 'spinner' }) => {
  if (type === 'skeleton-grid') {
    return (
      <div className="skeleton-grid-container grid grid-4" style={{ padding: '24px 0' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div
            key={index}
            className="skeleton-card animate-pulse"
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              height: '350px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.01)',
            }}
          >
            <div className="skeleton" style={{ width: '100%', paddingTop: '100%', borderRadius: 'var(--radius-md)' }}></div>
            <div className="skeleton" style={{ height: '12px', width: '35%', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ height: '16px', width: '90%', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '25%', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '50%', borderRadius: '4px', marginTop: 'auto' }}></div>
            <div className="skeleton" style={{ height: '38px', width: '100%', borderRadius: '0 0 var(--radius-md) var(--radius-md)', marginTop: '8px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  // Default Spinner with elegant modern ring and smooth spin
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0',
        width: '100%',
        gap: '16px',
      }}
    >
      <div
        className="premium-spinner"
        style={{
          width: '50px',
          height: '50px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '3px solid rgba(40, 116, 240, 0.1)',
            borderTop: '3px solid var(--primary)',
            borderRight: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            bottom: '6px',
            border: '2px dashed var(--success)',
            borderRadius: '50%',
            opacity: 0.5,
            animation: 'spinReverse 1.5s linear infinite',
          }}
        ></div>
      </div>
      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
        Loading experience...
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
