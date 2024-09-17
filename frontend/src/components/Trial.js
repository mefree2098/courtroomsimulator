// src/components/Trial.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function Trial() {
  const { caseId } = useParams();
  const [objectionType, setObjectionType] = useState('');
  const [ruling, setRuling] = useState('');

  const handleObjection = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/trial/objection',
        { caseId, objectionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRuling(res.data.ruling);
    } catch (error) {
      console.error('Error handling objection:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Trial Phase</h2>
      <div>
        <label>
          Objection Type:
          <select value={objectionType} onChange={(e) => setObjectionType(e.target.value)}>
            <option value="">Select Objection</option>
            <option value="relevance">Relevance</option>
            <option value="hearsay">Hearsay</option>
            <option value="speculation">Speculation</option>
            <option value="leading">Leading</option>
            <option value="asked and answered">Asked and Answered</option>
          </select>
        </label>
        <button onClick={handleObjection}>Object</button>
      </div>
      {ruling && (
        <div>
          <h3>Judge's Ruling</h3>
          <p>{ruling}</p>
        </div>
      )}
    </div>
  );
}

export default Trial;
