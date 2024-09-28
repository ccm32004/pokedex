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
  pokemons: () => {
    console.log('Fetching all pokemons'); // Add this line to see if the resolver is hit
    return pokemonData;
  },
};

module.exports = resolvers;
