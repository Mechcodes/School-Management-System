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

function UpdateForm({ modelName, id }) {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success"); // "success" or "error"

  useEffect(() => {
    fetchModelSchema(id);
    fetchExistingData(id);
  }, []);

  const fetchModelSchema = async (id) => {
    // console.log("CALLING DATA");
    try {
      const response = await fetch(`/api/${modelName.toLowerCase()}/getForm/${id}`);
      const data = await response.json();
      const regularFields = [];
      if(data.success==false){
        
        setErrorMessage(data.message);
        setSnackbarType('error');
        alert(data.message)
        window.history.back();
      }else{

        Object.entries(data[0]).forEach(([fieldName]) => {
          if (fieldName !== 'assignedClass' && fieldName !== 'class') {
            regularFields.push([fieldName]);
          }
        });
        setFields(regularFields);
      }

      setLoading(false); 
    } catch (error) {
      console.error("Error fetching model schema:", error);
    }
  };

  const fetchExistingData = async (id) => {
    try {
      const response = await fetch(`/api/${modelName.toLowerCase()}/get/${id}`);
      const data = await response.json();
      console.log("DATA COME", data)
      setFormData(data);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/${modelName.toLowerCase()}/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage(`${modelName} updated successfully.`);
        setErrorMessage(null);
        setSnackbarType("success");
      } else {
        const errorMessage = await response.text();
        setErrorMessage(`Failed to update ${modelName}`);
        setSuccessMessage(null);
        setSnackbarType("error");
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating', modelName, ':', error.message);
      setErrorMessage(`Error updating ${modelName}: ${error.message}`);
      setSuccessMessage(null);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <Loading />; 
  }

  return (
    
    <>
    
      <Box
        sx={{
          boxShadow: 3,
          p: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: "500px",
          margin: "auto",
          mt: 4,
          backgroundColor: "#f5f5f5",
          border: "1px solid #e0e0e0",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#333", mb: 3 }}>
          Update {modelName}
        </Typography>
        <form onSubmit={handleSubmit}>
          {console.log("Message",fields, "formData", formData)}
          {fields.map(([fieldName]) => (
           
            fieldName !== 'assignedClass' && fieldName !== 'class' && (
              <TextField
                key={fieldName}
                label={`* ${capitalizeFirstLetter(fieldName)}${fieldName === "dob" ? " (YYYY-MM-DD)" : ""}${fieldName === "gender" ? " (Male/Female)" : ""}`}
                fullWidth
                margin="normal"
                variant="outlined"
                color="primary"
                onChange={handleChange}
                id={fieldName}
                value={formData[fieldName] || ''}
                sx={{ mb: 2 }}
              />
            )
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              bgcolor: "#007bff",
              '&:hover': {
                bgcolor: "#0056b3",
              },
              mt: 2
            }}
          >
            Update
          </Button>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000} // 5 seconds
        onClose={handleCloseSnackbar}
      >
        {/* {console.log(snackbarType , successMessage , errorMessage)}; */}
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarType === "success" ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UpdateForm;
