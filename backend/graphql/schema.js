const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Name {
    english: String!
    japanese: String
    chinese: String
    french: String
  }

  type Base {
    HP: Int
    Attack: Int
    Defense: Int
    SpAttack: Int
    SpDefense: Int
    Speed: Int
  }

  type Pokemon {
    id: ID!
    name: Name!
    type: [String]!
    base: Base!
  }

  type Query {
    pokemons: [Pokemon]
    pokemon(id: ID!): Pokemon
  }
`;

module.exports = typeDefs;
