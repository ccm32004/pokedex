const fs = require('fs');

let pokemonData;
try {
  pokemonData = JSON.parse(fs.readFileSync('./data/pokedex.json', 'utf8'));
} catch (error) {
  console.error('Error reading pokemon data:', error);
  pokemonData = []; 
}

const mapPokemonData = (pokemon) => ({
  ...pokemon,
  base: {
    ...pokemon.base,
    Sp_Attack: pokemon.base['Sp. Attack'],  
    Sp_Defense: pokemon.base['Sp. Defense'],  
  },
});

const resolvers = {
  pokemon: ({ id }) => {
    const foundPokemon = pokemonData.find(pokemon => pokemon.id === id);
    return foundPokemon ? mapPokemonData(foundPokemon) : null; 
  },
  
  pokemons: () => pokemonData.map(mapPokemonData), 
};

module.exports = resolvers;
