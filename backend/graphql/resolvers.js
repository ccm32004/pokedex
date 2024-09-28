// graphql/resolvers.js
const fs = require('fs');

let pokemonData;
try {
  pokemonData = JSON.parse(fs.readFileSync('./data/pokedex.json', 'utf8'));
} catch (error) {
  console.error('Error reading pokemon data:', error);
}

const resolvers = {
  pokemon: ({ id }) => pokemonData.find(pokemon => pokemon.id === id),
  pokemons: () => 
    pokemonData.map(pokemon => ({
      ...pokemon,
      base: {
        ...pokemon.base,
        Sp_Attack: pokemon.base['Sp. Attack'],  // Map from JSON to GraphQL
        Sp_Defense: pokemon.base['Sp. Defense'],  // Map from JSON to GraphQL
      },
    })),
};

module.exports = resolvers;
