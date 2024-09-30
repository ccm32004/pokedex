import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonTable from './pages/PokemonTable';
import PokemonDetail from './pages/PokemonDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonTable />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

