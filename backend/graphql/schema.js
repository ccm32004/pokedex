const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Name {
    english: String
    japanese: String
    chinese: String
    french: String
  }

  type Base {
    HP: Int
    Attack: Int
    Defense: Int
    Sp_Attack: Int
    Sp_Defense: Int
    Speed: Int
  }

  type Pokemon {
    id: Int
    name: Name
    type: [String]
    base: Base
  }

  type Query {
    getPokemonById(id: Int!): Pokemon
    getAllPokemon: [Pokemon]
  }
`);

module.exports = schema;
