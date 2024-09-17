// src/components/CaseGeneration.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

function CaseGeneration() {
  const [role, setRole] = useState('prosecutor');
  const history = useHistory();

  const handleGenerateCase = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/case/generate',
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { caseId } = res.data;
      history.push(`/case/pretrial/${caseId}`);
    } catch (error) {
      console.error('Error generating case:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Choose Your Role</h2>
      <label>
        <input type="radio" value="prosecutor" checked={role === 'prosecutor'} onChange={() => setRole('prosecutor')} />
        Prosecutor
      </label>
      <label>
        <input type="radio" value="defense" checked={role === 'defense'} onChange={() => setRole('defense')} />
        Defense Attorney
      </label>
      <button onClick={handleGenerateCase}>Generate Case</button>
    </div>
  );
}

export default CaseGeneration;
