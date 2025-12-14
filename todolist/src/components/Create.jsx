import React, { useState } from 'react';
import axios from 'axios';

function Create() {
  const [task, setTask] = useState('');
  const handleAdd = () => {
    axios.post('/add', { task: task })
      .then(() => window.location.reload())
      .catch(err => console.log(err));
  }
  return (
    <div className='create_form'>
      <input type="text" placeholder='Enter Task' onChange={(e) => setTask(e.target.value)} />
      <button type="button" onClick={handleAdd}>Create</button>
    </div>
  )
}

export default Create;
