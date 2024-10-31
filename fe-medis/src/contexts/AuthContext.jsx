// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/me");
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post("/api/login", { email, password });
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    await axios.delete("/api/logout");
    setUser(null);
  };

  const register = async (userData) => {
    const response = await axios.post("/api/register", userData);
    return response.data;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register }}
    ></AuthContext.Provider>
  );
};
