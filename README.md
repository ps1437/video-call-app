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

  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Username', field: 'username' },
    { headerName: 'Email', field: 'email' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const page = gridApi ? Math.floor(gridApi.getFirstDisplayedRow() / paginationPageSize) + 1 : 1;

    axios.get(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${paginationPageSize}`)
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
    fetchData();
  };

  const customPaginationTemplate = (params) => {
    const totalPages = Math.ceil(totalRowCount / paginationPageSize);
    const currentPage = params.api.paginationGetCurrentPage();
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const goToPreviousPage = () => {
      if (!isFirstPage) {
        params.api.paginationGoToPreviousPage();
      }
    };

    const goToNextPage = () => {
      if (!isLastPage) {
        params.api.paginationGoToNextPage();
      }
    };

    return (
      <div className="ag-pagination">
        <span className={`ag-icon ag-icon-first ${isFirstPage ? 'ag-disabled' : ''}`} onClick={() => goToPreviousPage()}></span>
        <span className={`ag-icon ag-icon-previous ${isFirstPage ? 'ag-disabled' : ''}`} onClick={() => goToPreviousPage()}></span>
        Page {currentPage}/{totalPages}
        <span className={`ag-icon ag-icon-next ${isLastPage ? 'ag-disabled' : ''}`} onClick={() => goToNextPage()}></span>
        <span className={`ag-icon ag-icon-last ${isLastPage ? 'ag-disabled' : ''}`} onClick={() => goToNextPage()}></span>
      </div>
    );
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
        paginationNumberTemplate={customPaginationTemplate}
      />
    </div>
  );
};

export default YourComponent;
