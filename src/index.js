import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

// Neste arquivo index.js, há a configuração da renderização do aplicativo React. 
// Ele importa os pacotes necessários (React, ReactDOM), arquivos de estilo (bootstrap.min.css, index.css) e o componente principal (App).

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);