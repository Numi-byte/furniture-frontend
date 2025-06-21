import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
  <CartProvider>
    <App />
    <Toaster
      position="top-right"                // ← slide‑in corner
      toastOptions={{
        duration: 2200,
        style: {
          background: 'var(--gold)',
          color: '#000',
          fontWeight: 600,
          borderRadius: 8,
          padding: '.7rem 1rem'
        }
      }}
    />
  </CartProvider>
</React.StrictMode>
);
