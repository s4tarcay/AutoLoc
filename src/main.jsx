import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AutoLocHome from './componentes/AutoLocHome/AutoLocHome'; // Verifique o caminho
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AutoLocHome />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
