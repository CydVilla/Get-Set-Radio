import React, { useContext, useEffect, useState } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellEditStopReasons,
} from "@mui/x-data-grid";
import { UserContext } from "./context/UserContext";
import Button from '@mui/material/Button';

const rows = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];
const columns = [
  { field: "title", headerName: "Title", width: 150, editable: true },
  { field: "artist", headerName: "Artist", width: 150, editable: true },
  { field: "year", headerName: "Year", width: 150, editable: true },
];

export const UserEdit = () => {
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [{ token }] = useContext(UserContext);

  const handleDeleteSelected = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/trash", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: selectedRows,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTableData((prev) => {
          const newState = prev.filter((row) => !selectedRows.includes(row.id));
          return newState;
        });
        setSelectedRows([]);
      });
  };

  useEffect(() => {
    (async () => {
      fetch(process.env.REACT_APP_API_ENDPOINT + "users/myUploads", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTableData(
            data.map((row, index) => {
              return {
                title: row.title,
                id: row._id,
                artist: row.artist,
                year: row.year,
              };
            })
          );
        });
    })();
  }, []);


  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        checkboxSelection={checkboxSelection}
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
        }}
        onCellEditCommit={(params, event) => {
          console.log(params, event, "stuff");
          fetch(process.env.REACT_APP_API_ENDPOINT + "users/myUpdate", {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: params.id,
              field: params.field,
              value: params.value,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data, "lo");
            });
        }}
      />
      <Button variant="contained" sx={{mt : '4px'}} onClick={handleDeleteSelected}>Delete Selected</Button>
    </div>
  );
};
