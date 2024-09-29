import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
} from '@mui/material';
import { GET_ALL_POKEMON } from './queries';

const PokemonTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: GET_ALL_POKEMON,
        });
        setData(response.data.data.pokemons || []);
      } catch (error) {
        console.error('Error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getValue = (row, property) => {
    const keys = property.split('.');
    return keys.reduce((obj, key) => (obj ? obj[key] : undefined), row);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valueA = getValue(a, orderBy);
      const valueB = getValue(b, orderBy);

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, order, orderBy]);

  const visibleRows = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="pokemon table">
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'id' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'name.english' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name.english'}
                    direction={orderBy === 'name.english' ? order : 'asc'}
                    onClick={() => handleRequestSort('name.english')}
                  >
                    English Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Types</TableCell>
                <TableCell sortDirection={orderBy === 'base.HP' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'base.HP'}
                    direction={orderBy === 'base.HP' ? order : 'asc'}
                    onClick={() => handleRequestSort('base.HP')}
                  >
                    HP
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'base.Attack' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'base.Attack'}
                    direction={orderBy === 'base.Attack' ? order : 'asc'}
                    onClick={() => handleRequestSort('base.Attack')}
                  >
                    Attack
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'base.Defense' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'base.Defense'}
                    direction={orderBy === 'base.Defense' ? order : 'asc'}
                    onClick={() => handleRequestSort('base.Defense')}
                  >
                    Defense
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'base.Sp_Attack' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'base.Sp_Attack'}
                    direction={orderBy === 'base.Sp_Attack' ? order : 'asc'}
                    onClick={() => handleRequestSort('base.Sp_Attack')}
                  >
                    Special Attack
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'base.Sp_Defense' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'base.Sp_Defense'}
                    direction={orderBy === 'base.Sp_Defense' ? order : 'asc'}
                    onClick={() => handleRequestSort('base.Sp_Defense')}
                  >
                    Special Defense
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'base.Speed' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'base.Speed'}
                    direction={orderBy === 'base.Speed' ? order : 'asc'}
                    onClick={() => handleRequestSort('base.Speed')}
                  >
                    Speed
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name.english}</TableCell>
                  <TableCell>{row.type.join(', ')}</TableCell>
                  <TableCell>{row.base.HP}</TableCell>
                  <TableCell>{row.base.Attack}</TableCell>
                  <TableCell>{row.base.Defense}</TableCell>
                  <TableCell>{row.base.Sp_Attack}</TableCell>
                  <TableCell>{row.base.Sp_Defense}</TableCell>
                  <TableCell>{row.base.Speed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default PokemonTable;
