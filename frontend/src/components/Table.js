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

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name.english', label: 'English Name' },
    { id: 'type', label: 'Types', sortable: false },
    { id: 'base.HP', label: 'HP' },
    { id: 'base.Attack', label: 'Attack' },
    { id: 'base.Defense', label: 'Defense' },
    { id: 'base.Sp_Attack', label: 'Special Attack' },
    { id: 'base.Sp_Defense', label: 'Special Defense' },
    { id: 'base.Speed', label: 'Speed' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="pokemon table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      backgroundColor: orderBy === column.id ? 'primary.light' : 'inherit', // Highlight background
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => column.sortable !== false && handleRequestSort(column.id)}
                      sx={{
                        color: orderBy === column.id ? 'primary.main' : 'inherit',
                        fontWeight: orderBy === column.id ? 'bold' : 'normal', // Bold active label
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
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
