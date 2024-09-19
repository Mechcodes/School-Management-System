import React from 'react';
import DynamicForm from '../components/Form';

function AddStudent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-green-300 to-yellow-400">
      
      <DynamicForm modelName={'Student'} />
    </div>
  );
}

export default AddStudent;
