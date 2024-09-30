import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { GET_POKEMON_BY_ID } from "../queries/queries";
import "./PokemonDetail.css";

const PokemonDetail = () => {
  const { id } = useParams();
  const imageUrl = `/images/${String(id).padStart(3, "0")}.png`;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_API_URL, {
          query: GET_POKEMON_BY_ID(id),
        });
        setPokemon(response.data.data.pokemon);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
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

  const totalBaseStats =
    pokemon.base.HP +
    pokemon.base.Attack +
    pokemon.base.Defense +
    pokemon.base.Sp_Attack +
    pokemon.base.Sp_Defense +
    pokemon.base.Speed;

  return (
    <div className="container">
      {/* Pokémon Name */}
      <h1 className="pokemon-name">
        {pokemon.name.english}
      </h1>

      {/* Row for Image, Other Languages, and Base Stats */}
      <div className="details-row">
        
        {/* Left Column - Pokémon Image */}
        <div className="image-column">
          <img
            src={imageUrl}
            alt={`Pokémon ID ${id}`}
            className="image"
          />
        </div>

        {/* Middle Column - Other Languages and Types */}
        <div className="languages-column">
          <h2>Other Languages</h2>
          <ul className="lang">
            <li>Japanese: {pokemon.name.japanese}</li>
            <li>Chinese: {pokemon.name.chinese}</li>
            <li>French: {pokemon.name.french}</li>
          </ul>

          <h2>Type:</h2>
          <Stack direction="row" spacing={1}>
            {pokemon.type.map((type) => (
              <Button
                key={type}
                variant="contained"
                disableRipple
                disableElevation
                className="button-type"
              >
                {type}
              </Button>
            ))}
          </Stack>
        </div>

        {/* Right Column - Base Stats */}
        <div className="base-stats-column">
          <h2 className="base-stats-title">Base Stats:</h2>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {Object.entries(pokemon.base).map(([stat, value]) => (
                  <TableRow key={stat}>
                    <TableCell component="th" scope="row">
                      {stat.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell align="right">{value}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Total Base Stats</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totalBaseStats}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
