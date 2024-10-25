import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AutoLocHome from './componentes/AutoLocHome/AutoLocHome'; // Verifique o caminho
import Veiculos from './componentes/Veiculos/Veiculos'; // Importe o seu componente Veículos
import Localizacao from './componentes/Localizacao/Localizacao'; // Importe o seu componente Localização
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AutoLocHome />} /> {/* AutoLocHome será carregado quando acessar "/" */}
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="localizacao" element={<Localizacao />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
