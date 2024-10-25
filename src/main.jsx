import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AutoLocHome from './componentes/AutoLocHome/AutoLocHome';
import Veiculos from './componentes/Veiculos/Veiculos';
import Localizacao from './componentes/Localizacao/Localizacao';
import LoginGoogle from './componentes/Login/LoginGoogle';
import Registro from './componentes/Registro/Registro'; // Importe o componente Registro
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AutoLocHome />} />
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="localizacao" element={<Localizacao />} />
          <Route path="login" element={<LoginGoogle />} />
          <Route path="registro" element={<Registro />} /> {/* Rota para Registro */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
