import React from 'react';
import DynamicForm from '../components/Form';

function AddTeacher() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
      <DynamicForm modelName={'Teacher'} />
    </div>
  );
}

export default AddTeacher;
