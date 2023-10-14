import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const YourComponent = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [paginationPageSize] = useState(10);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Username', field: 'username' },
    { headerName: 'Email', field: 'email' }
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data whenever the current page changes

  const fetchData = () => {
    axios.get(`https://jsonplaceholder.typicode.com/users?_page=${currentPage}&_limit=${paginationPageSize}`)
      .then(response => {
        setRowData(response.data);
        if (response.headers['x-total-count']) {
          const totalCount = parseInt(response.headers['x-total-count'], 10);
          setTotalRowCount(totalCount);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const onGridReady = params => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(totalRowCount / paginationPageSize);
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={goToNextPage} disabled={currentPage * paginationPageSize >= totalRowCount}>Next</button>
      </div>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={false}  // Disable Ag-Grid pagination to use custom pagination
        domLayout='autoHeight'
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default YourComponent;
