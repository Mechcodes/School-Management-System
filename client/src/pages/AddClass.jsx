import React from 'react';
import DynamicForm from '../components/Form';

function AddClass() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <DynamicForm modelName={'Class'} />
    </div>
  );
}

export default AddClass;
