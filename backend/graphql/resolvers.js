const fs = require('fs');

const getPokemonData = () => {
  const data = fs.readFileSync('./data/pokedex.json', 'utf8');
  return JSON.parse(data);
};

const resolvers = {
//these are in essence, all the possible queries that can be made to the graphql server
  getPokemonById: ({ id }) => {
    const pokedex = getPokemonData();
    return pokedex.find(pokemon => pokemon.id === id);
  },
  getAllPokemon: () => {
    return getPokemonData();
  }
};

module.exports = resolvers;
