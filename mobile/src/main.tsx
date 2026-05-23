import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import '../../src/styles.css' // ← usa o original diretamente

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)