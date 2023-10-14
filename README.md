import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

interface YourComponentProps {}

const YourComponent: React.FC<YourComponentProps> = () => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);
  const [paginationNumberTemplate, setPaginationNumberTemplate] = useState<string>('[page] of [totalPages]');
  // Add other state variables for server-side data handling.

  const columnDefs = [ /* Define your column definitions */ ];

  useEffect(() => {
    // Fetch initial data when component mounts
    fetchData();
  }, []);

  const fetchData = (pageNumber: number, pageSize: number, sortModel: any[]) => {
    // Implement the function to fetch data from the server based on the provided parameters (pageNumber, pageSize, sortModel).
    // Make an API call to retrieve data and update the rowData state.
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onPageSizeChanged = (newPageSize: number) => {
    setPaginationPageSize(newPageSize);
    fetchData(1, newPageSize, gridApi.getSortModel());
  };

  const onPaginationPageChanged = (page: number) => {
    fetchData(page, paginationPageSize, gridApi.getSortModel());
  };

  const onSortChanged = () => {
    const sortModel = gridApi.getSortModel();
    fetchData(1, paginationPageSize, sortModel);
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
        onPaginationPageChanged={onPaginationPageChanged}
        onSortChanged={onSortChanged}
        onPageSizeChanged={onPageSizeChanged}
        paginationNumberTemplate={paginationNumberTemplate}
      />
    </div>
  );
};

export default YourComponent;
