import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../api/authApi";

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password });
    localStorage.setItem("token", data.token);
    const nextUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role
    };
    setUser(nextUser);
    return data;
  };

  const register = async (payload) => {
    const { data } = await registerRequest(payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token: localStorage.getItem("token"),
      isAuthenticated: Boolean(user && localStorage.getItem("token")),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
