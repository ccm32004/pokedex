import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonDetail = () => {
  const { id } = useParams();
  const imageUrl = `/images/${String(id).padStart(3, '0')}.png`; 
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
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
        `,
        });
        setPokemon(response.data.data.pokemon);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!pokemon) return <p>No Pokémon found</p>;

  // Calculate total base stats
  const totalBaseStats = 
    pokemon.base.HP + 
    pokemon.base.Attack + 
    pokemon.base.Defense + 
    pokemon.base.Sp_Attack + 
    pokemon.base.Sp_Defense + 
    pokemon.base.Speed;

  return (
    <div>
      <h1>{pokemon.name.english}</h1>
      <img src={imageUrl} alt={`Pokémon ID ${id}`} />
      <h2>Names:</h2>
      <ul>
        <li>English: {pokemon.name.english}</li>
        <li>Japanese: {pokemon.name.japanese}</li>
        <li>Chinese: {pokemon.name.chinese}</li>
        <li>French: {pokemon.name.french}</li>
      </ul>
      <h2>Type: {pokemon.type.join(', ')}</h2>
      <h3>Base Stats:</h3>
      <ul>
        <li>HP: {pokemon.base.HP}</li>
        <li>Attack: {pokemon.base.Attack}</li>
        <li>Defense: {pokemon.base.Defense}</li>
        <li>Special Attack: {pokemon.base.Sp_Attack}</li>
        <li>Special Defense: {pokemon.base.Sp_Defense}</li>
        <li>Speed: {pokemon.base.Speed}</li>
        <li><strong>Total Base Stats: {totalBaseStats}</strong></li>
      </ul>
    </div>
  );
};

export default PokemonDetail;
