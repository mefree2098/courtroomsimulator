// src/components/CaseSummary.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CaseSummary() {
  const [caseSummaries, setCaseSummaries] = useState([]);

  useEffect(() => {
    const fetchCaseSummaries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/case/summary', { headers: { Authorization: `Bearer ${token}` } });
        setCaseSummaries(res.data.caseSummaries);
      } catch (error) {
        console.error('Error fetching case summaries:', error.response.data.message);
      }
    };
    fetchCaseSummaries();
  }, []);

  return (
    <div>
      <h2>Case Summaries</h2>
      <ul>
        {caseSummaries.map((summary) => (
          <li key={summary._id}>
            <p>Verdict: {summary.verdict}</p>
            <p>Actual Outcome: {summary.actualOutcome}</p>
            <p>Summary: {summary.summaryText}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CaseSummary;
