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

  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Username', field: 'username' },
    { headerName: 'Email', field: 'email' }
    // Add more columns as needed
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const page = gridApi ? Math.floor(gridApi.getFirstDisplayedRow() / paginationPageSize) + 1 : 1;

    axios.get(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${paginationPageSize}`)
      .then(response => {
        setRowData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const onGridReady = params => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    fetchData();
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={paginationPageSize}
        domLayout='autoHeight'
        onGridReady={onGridReady}
        onPaginationChanged={fetchData}
      />
    </div>
  );
};

export default YourComponent;
