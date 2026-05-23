import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './mobile-styles.css' // ← usa esse em vez do ../../src/styles.css

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)