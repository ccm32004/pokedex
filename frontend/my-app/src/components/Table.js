import React, { useState } from 'react';
import _ from 'lodash';
import { GET_ALL_POKEMON } from '../graphql/queries';

const PokemonTable = () => {
  const { loading, error, data } = useQuery(GET_ALL_POKEMON);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching Pokémon data!</p>;

  const pokemons = data.pokemon_v2_pokemon.map((pokemon) => {
    const stats = _.keyBy(pokemon.pokemon_v2_pokemonstats, (s) => s.pokemon_v2_stat.name);
    const total = Object.values(stats).reduce((acc, stat) => acc + stat.base_stat, 0);
    
    return {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name).join(', '),
      total,
      hp: stats.hp.base_stat,
      attack: stats.attack.base_stat,
      defense: stats.defense.base_stat,
      spAtk: stats['special-attack'].base_stat,
      spDef: stats['special-defense'].base_stat,
      speed: stats.speed.base_stat,
    };
  });

  const filteredAndSortedPokemons = _.orderBy(
    pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [sortConfig.key],
    [sortConfig.direction]
  );

  const paginatedPokemons = filteredAndSortedPokemons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAndSortedPokemons.length / ITEMS_PER_PAGE);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <h1>Pokémon Table</h1>
      <input
        type="text"
        placeholder="Search Pokémon by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table border="1">
        <thead>
          <tr>
            {['id', 'name', 'type', 'total', 'hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'].map((header, index) => (
              <th key={index} onClick={() => handleSort(header)}>
                {header.charAt(0).toUpperCase() + header.slice(1)} 
                {sortConfig.key === header && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedPokemons.map((pokemon) => (
            <tr key={pokemon.id}>
              <td>{pokemon.id}</td>
              <td>{pokemon.name}</td>
              <td>{pokemon.type}</td>
              <td>{pokemon.total}</td>
              <td>{pokemon.hp}</td>
              <td>{pokemon.attack}</td>
              <td>{pokemon.defense}</td>
              <td>{pokemon.spAtk}</td>
              <td>{pokemon.spDef}</td>
              <td>{pokemon.speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PokemonTable;

