import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import UpdateButton from "./UpdateButton";
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading";
import { Button, Snackbar, Alert } from "@mui/material";

function Table({ modelName }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    fetchData();
  }, []);

  const selectedFieldsMap = {
    student: ['name', 'gender', 'dob', 'email', 'feesPaid', 'class.name', '_id'],
    teacher: ['email', 'name', 'gender', 'dob', 'Salary', 'assignedClass.name', '_id'],
    class: ['name', 'year', 'teacher.name', 'maxCapacity', '_id']
  };

  const handleDelete = async (lowerCaseModelName, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const accessToken = localStorage.getItem('access_token');
        // console.log("THIS IS ACCESS TOKEN HERE3 : ",accessToken)

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${lowerCaseModelName}/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, 
          },
        });
        
        let fetchRes = await res.json();
        // console.log(fetchRes.message);
        if(fetchRes.success==false){
          setSnackbarMessage(fetchRes.message);
          setSnackbarType('error');
        }else{

          setSnackbarMessage(`Item deleted successfully.`);
          setSnackbarType('success');
        }
        fetchData(); 
      } catch (error) {
        setSnackbarMessage(`Failed to delete item.`);
        setSnackbarType('error');
      }
      setOpenSnackbar(true);
    }
  };

  const handleUpdate = async (lowerCaseModelName, id) => {
    navigate(`${lowerCaseModelName}/update/${id}`);
  };

  const fetchData = async () => {
    try {
      const lowerCaseModelName = modelName.toLowerCase();
      const accessToken = localStorage.getItem('access_token');
      // console.log("THIS IS ACCESS TOKEN HERE4 : ",accessToken)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${lowerCaseModelName}/get`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, 
        },
      });
      const data = await response.json();

      const rowsWithSelectedFields = data.map((row, index) => {
        const selectedFields = selectedFieldsMap[lowerCaseModelName];
        const selectedValues = selectedFields.reduce((acc, key) => {
          const keys = key.split('.');
          let value = row;
          for (let i = 0; i < keys.length; i++) {
            value = value[keys[i]];
            if (value === undefined || value === null) {
              value = '';
              break;
            }
          }
          if (value !== undefined) {
            if (key === 'dob') {
              value = value.slice(0, 10);
            }
            acc[key] = value;
          }
          return acc;
        }, {});
        return {
          id: index + 1,
          ...selectedValues
        };
      });

      const firstRow = rowsWithSelectedFields[0];
      const columnNames = Object.keys(firstRow);
      const gridColumns = columnNames.map((columnName) => ({
        field: columnName,
        headerName: getHeaderTitle(columnName),
        width: columnName === 'name' ? 180 : 150,
        headerAlign: 'left',
        renderCell: (params) => {
          if (modelName === 'Class' && columnName === 'name') {
            return (
              <Link to={`/class-analytics/${params.row.name}`} className="text-blue-600 hover:text-blue-800">
                {params.value}
              </Link>
            );
          } else {
            return params.value;
          }
        }
      }));

      if (modelName === 'Class') {
        gridColumns.push({
          field: 'details',
          headerName: 'Details',
          width: 120,
          renderCell: (params) => (
            <div className="flex items-center justify-center">
              <Link to={`/class-analytics/${params.row.name}`}>
                <Button variant="contained" color="primary" size="small">Details</Button>
              </Link>
            </div>
          ),
        });
      }

      gridColumns.push({
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        headerAlign: 'center',
        renderCell: (params) => (
          <div className="flex items-center justify-center space-x-2">
            <DeleteButton onClick={() => handleDelete(lowerCaseModelName, params.row._id)} />
            <UpdateButton onClick={() => handleUpdate(lowerCaseModelName, params.row._id)} />
          </div>
        ),
      });

      const visibleColumns = gridColumns.filter(column => column.field !== '_id');
      setRows(rowsWithSelectedFields);
      setColumns(visibleColumns);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getHeaderTitle = (columnName) => {
    switch (columnName) {
      case 'dob':
        return 'Date of Birth';
      case 'assignedClass.name':
        return 'Assigned Class';
      case 'maxCapacity':
        return 'Max Capacity';
      case 'teacher.name':
        return 'Assigned Teacher';
      case 'class.name':
        return 'Class Name';
      case 'feesPaid':
        return 'Fees Paid';
      case 'id':
        return 'ID';
      default:
        return columnName.charAt(0).toUpperCase() + columnName.slice(1);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="p-4 bg-gradient-to-r from-purple-100 via-blue-50 to-green-100" style={{ height: 500, width: "100%" }}>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      ) : (
        <>
          <DataGrid
            sx={{
              boxShadow: 2,
              border: '1px solid #ddd',
              fontSize: 14,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f0f0f0',
                color: '#333',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #ddd',
              },
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: '#f9f9f9',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#e3f2fd',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#f0f0f0',
                borderTop: '1px solid #ddd',
              },
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default Table;
