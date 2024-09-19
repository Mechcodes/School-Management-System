import React from 'react';
import { useParams } from "react-router-dom";
import UpdateForm from '../components/UpdateForm';

function UpdateFormPage() {
  const { model, id } = useParams();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: 'linear-gradient(to right, #FFAFBD, #ffc3a0)', 
        backgroundAttachment: 'fixed',
      }}
    >
      
        <UpdateForm modelName={model} id={id} />
      
    </div>
  );
}

export default UpdateFormPage;
