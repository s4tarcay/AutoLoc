import React from 'react';
import Header from './componentes/Header/Header'; // Importe o Header
import { Outlet } from 'react-router-dom'; // Para renderizar o conteúdo das rotas

const App = () => {
  return (
    <div style={{ paddingTop: '56px' }}> {/* Ajuste conforme necessário */}
      <Header /> 
      <Outlet />
    </div>
  );
};

export default App;
