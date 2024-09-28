const fs = require('fs');
const path = require('path');

// Read data from the JSON file
const pokedexData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/pokedex.json'), 'utf-8'));

const resolvers = {
  Query: {
    pokemons: () => pokedexData,  // Return all Pokémon
    pokemon: (parent, args) => pokedexData.find(pokemon => pokemon.id === parseInt(args.id)) // Return specific Pokémon by ID
  },
  Pokemon: {
    base: (parent) => {
      return {
        HP: parent.base.HP,
        Attack: parent.base.Attack,
        Defense: parent.base.Defense,
        SpAttack: parent.base["Sp. Attack"],
        SpDefense: parent.base["Sp. Defense"],
        Speed: parent.base.Speed
      };
    }
  }
};

module.exports = resolvers;
