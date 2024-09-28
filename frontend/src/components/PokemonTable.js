import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import { GET_ALL_POKEMON } from './queries';

const PokemonTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: GET_ALL_POKEMON,
        });
        setData(response.data.data.pokemons);
      } catch (error) {
        console.log('Error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'English Name',
        accessor: 'name.english',
      },
      {
        Header: 'Types',
        accessor: 'type',
        Cell: ({ value }) => value.join(', '),
      },
      {
        Header: 'HP',
        accessor: 'base.HP',
      },
      {
        Header: 'Attack',
        accessor: 'base.Attack',
      },
      // Add more columns as needed
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    gotoPage,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage, // Include this
    nextPage,     // Include this
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <table {...getTableProps()} style={{ width: '100%', border: 'solid 1px black' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={previousPage} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={nextPage} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
      </div>
      <span>
        Page <strong>{state.pageIndex + 1} of {pageCount}</strong>
      </span>
      <select
        value={state.pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PokemonTable;
