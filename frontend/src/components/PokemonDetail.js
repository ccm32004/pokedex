import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import "./PokemonDetail.css";

const PokemonDetail = () => {
  const { id } = useParams();
  const imageUrl = `/images/${String(id).padStart(3, "0")}.png`;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.post("http://localhost:4000/graphql", {
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
    <div style={{ justifyItems: "center", width: "100vw", height: "100vh", marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80rem",
          margin: "auto",
          // background: "gray",
        }}
      >
        {/* Left side - Pokémon Image */}
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <img
            src={imageUrl}
            alt={`Pokémon ID ${id}`}
            style={{
              borderRadius: "16px",
              width: "35%",
              background: "lightgray",
              padding: "2rem",
              borderColor: "black",
              borderWidth: "5px",
            }}
          />
          <div style={{ padding: "2rem", flexGrow: 1 }}>
            <h1 style={{ fontSize: "3.875rem", lineHeight: "2.25rem" }}>
              {pokemon.name.english}
            </h1>

            <h2>Other Languages</h2>
            <ul class="lang">
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
                  sx={{
                    pointerEvents: "none", // Disable click events
                    backgroundColor: "#1976d2", // You can change the color as needed
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1976d2", // Prevent color change on hover
                    },
                  }}
                >
                  {type}
                </Button>
              ))}
            </Stack>
          </div>
        </div>

        {/* Right side - Pokémon details */}
        <div style={{margin: "1rem"}}>
          <h3 style={{fontSize: "3rem", margin: 0.5}}>Base Stats:</h3>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    HP
                  </TableCell>
                  <TableCell align="right">{pokemon.base.HP}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Attack
                  </TableCell>
                  <TableCell align="right">{pokemon.base.Attack}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Defense
                  </TableCell>
                  <TableCell align="right">{pokemon.base.Defense}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Special Attack
                  </TableCell>
                  <TableCell align="right">{pokemon.base.Sp_Attack}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Special Defense
                  </TableCell>
                  <TableCell align="right">{pokemon.base.Sp_Defense}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Speed
                  </TableCell>
                  <TableCell align="right">{pokemon.base.Speed}</TableCell>
                </TableRow>
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
