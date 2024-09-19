import React from 'react'
import Table from '../components/Table'
import AddButton from '../components/AddButton'
export default function Student(){
  return (
    <div className='bg-blue-200'>
      <AddButton ModelName={'Student'}/>
      <Table modelName={'Student'}/>
    </div> 
  )
}