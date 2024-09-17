// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend or decode locally
          // For simplicity, we'll assume token is valid
          setUser({ token });
        } catch {
          localStorage.removeItem('token');
        }
      }
    };
    verifyToken();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
