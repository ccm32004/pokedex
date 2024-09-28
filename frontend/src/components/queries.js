// src/queries.js
export const GET_ALL_POKEMON = `
  {
    pokemons {
      id
      name {
        english
      }
      type
      base {
        HP
        Attack
        Defense
        Sp_Attack
        Sp_Defense
        Speed
      }
    }
  }
`;
