// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

//export default App;

// import React from 'react';
// //import PokemonList from './components/PokemonList'; // Import the PokemonList component
// //import PokemonTable from './components/PokemonTable';
// import PokemonTable from './components/Table';

// const App = () => (
//   <div>
//     <h1>Pokémon Table</h1>
//     <PokemonTable />{/* Use the PokemonList component here */}
//   </div>
// );

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonTable from './components/Table';
import PokemonDetail from './components/PokemonDetail';

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

{/* <TableCell>
                    <Router>
                    <Link to={`/pokemon/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {row.name.english}
                    </Link>
                    </Router>
                  </TableCell> */}

