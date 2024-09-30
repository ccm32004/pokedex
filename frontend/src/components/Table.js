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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { GET_ALL_POKEMON } from './queries';

const PokemonTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

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

  const uniqueTypes = useMemo(() => {
    const typesSet = new Set();
    data.forEach(pokemon => {
      pokemon.type.forEach(type => typesSet.add(type));
    });
    return Array.from(typesSet);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((pokemon) => {
      const matchesName = pokemon.name.english.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? pokemon.type.includes(selectedType) : true;
      return matchesName && matchesType;
    });
  }, [data, searchTerm, selectedType]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, order, orderBy]);

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
      <Box sx={{ display: 'flex', flexDirection: "row", alignItems: 'center', mb: 2, marginLeft: '15px', marginTop: "20px"}}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2}}
          size='small'
        />
        <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="type-select-label" size='small'>Type</InputLabel>
          <Select
            labelId="type-select-label"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            label="Type"
            size='small'
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {uniqueTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
                      backgroundColor: orderBy === column.id ? 'primary.light' : 'inherit',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => column.sortable !== false && handleRequestSort(column.id)}
                      sx={{
                        color: orderBy === column.id ? 'primary.main' : 'inherit',
                        fontWeight: orderBy === column.id ? 'bold' : 'normal',
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
                <TableRow
                  key={row.id}
                  sx={{ '&:hover': { backgroundColor: 'grey.200', cursor: 'pointer', padding: '10px' } }} // Hover effect
                >
                   <TableCell size='small'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={`/sprites/${String(row.id).padStart(3, '0')}MS.png`} 
                        alt={`Pokémon ${row.id}`} 
                        style={{ width: '50px', height: '50px', borderRadius: '8px', marginRight: '8px' }} 
                      />
                      {row.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                        to={`/pokemon/${row.id}`}
                        style={{
                            textDecoration: 'underline',
                            color: '#007bff', // Bootstrap primary color or your preferred link color
                            cursor: 'pointer'
                        }}
                    >
                        {row.name.english}
                    </Link>
                  </TableCell>
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
