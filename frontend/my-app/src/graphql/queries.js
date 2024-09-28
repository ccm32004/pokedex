import { gql } from '@apollo/client';

export const GET_ALL_POKEMON = gql`
  query {
    getAllPokemon {
      id
      name {
        english
      }
      type
      base {
        HP
        Attack
        Defense
        Sp_Attack: Sp_Attack
        Sp_Defense: Sp_Defense
        Speed
      }
    }
  }
`;


export const GET_POKEMON_BY_ID = gql`
  query GetPokemonById($id: Int!) {
    getPokemonById(id: $id) {
      id
      name {
        english
      }
      type
      base {
        HP
      }
    }
  }
`;
