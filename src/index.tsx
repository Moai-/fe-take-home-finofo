import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { FruitProvider } from './app/context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <FruitProvider>
      <App />
    </FruitProvider>
  </React.StrictMode>
);
