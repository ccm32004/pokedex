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

export const GET_POKEMON_BY_ID = (id) => `
  query {
    pokemon(id: ${id}) {
      id
      name {
        english
        japanese
        chinese
        french
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

