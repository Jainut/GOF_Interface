import React from 'react';

export default function Header() {
  return (
    <header style={{
      backgroundColor: '#4b0082',
      width: '100%',
      padding: '15px 30px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ color: 'black', margin: 0, fontSize: '24px' }}>DashBoard</h1>
      <span style={{ color: '#ff00ff', fontWeight: 'bold', fontSize: '20px' }}>VisAlay</span>
    </header>
  );
}