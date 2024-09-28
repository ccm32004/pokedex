// src/PokemonList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            {
              pokemons {
                id
                name {
                  english
                }
              }
            }
          `,
        });

        setPokemons(response.data.data.pokemons);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {pokemons.map(pokemon => (
        <li key={pokemon.id}>{pokemon.name.english}</li>
      ))}
    </ul>
  );
};

export default PokemonList;
