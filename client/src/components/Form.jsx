import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loading from "./Loading"; 

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function DynamicForm({ modelName }) {
  const [loading, setLoading] = useState(true); 
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success"); // "success" or "error"

  useEffect(() => {
    fetchModelSchema();
  }, []);

  const fetchModelSchema = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      // console.log("THIS IS ACCESS TOKEN HERE2 : ",accessToken)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${modelName.toLowerCase()}/getForm`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      const modelSchema = data[0];

      if (!Object.keys(modelSchema).length) {
        return;
      }

      const regularFields = [];

      Object.entries(modelSchema).forEach(([fieldName]) => {
        regularFields.push([fieldName]);
      });

      setFields(regularFields);
      setLoading(false);
    } catch (error) {
      setErrorMessage(`Error fetching model schema: ${error.message}`);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${modelName.toLowerCase()}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setSuccessMessage(`${modelName} created successfully.`);
        setErrorMessage(null);
        setSnackbarType("success");
      } else {
        const errorMessage = await response.text();
        setErrorMessage(`Failed to create ${modelName}`);
        setSuccessMessage(null);
        setSnackbarType("error");
      }
      setOpenSnackbar(true);
    } catch (error) {
      setErrorMessage(`Error creating ${modelName}: ${error.message}`);
      setSuccessMessage(null);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-200 via-blue-200 to-blue-300">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Box
        sx={{
          boxShadow: 8,
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: "600px",
          margin: "auto",
          mt: 6,
          textAlign: "center",
          background: 'linear-gradient(135deg, #f3f9d2, #e5f7a3)', 
          border: '2px solid #4caf50',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography variant="h5" gutterBottom color="#4caf50">
          Add {modelName}
        </Typography>
        <form onSubmit={handleSubmit}>
          {fields.map(([fieldName]) => (
            <TextField
              key={fieldName}
              label={`* ${capitalizeFirstLetter(fieldName)}${fieldName === "dob" ? " (YYYY-MM-DD)" : ""}${fieldName === "gender" ? " (Male/Female)" : ""}`}
              fullWidth
              margin="normal"
              variant="outlined"
              color="success" 
              SelectProps={{
                native: true,
              }}
              InputProps={fieldName === "email" ? { inputMode: "email", pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" } : {}}
              onChange={handleChange}
              id={fieldName}
              value={formData[fieldName] || ''}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#4caf50', 
                  },
                  '&:hover fieldset': {
                    borderColor: '#388e3c', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2c6c2f', 
                  },
                },
              }}
            />
          ))}
          <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarType === "success" ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default DynamicForm;
