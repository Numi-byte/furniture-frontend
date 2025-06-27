// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_BASE } from '../api';  // ← your API helper

/* --- Types ---------------------------------------------------------- */
interface UserPayload {
  id: number;
  email: string;
  role: string; // 'admin' | 'buyer'
}

interface AuthContextShape {
  user: UserPayload | null;
  token: string | null;
  login: (email: string, password: string) => Promise<UserPayload>;
  logout: () => void;
}

/* --- Context -------------------------------------------------------- */
const AuthContext = createContext<AuthContextShape>(null!);
export const useAuth = () => useContext(AuthContext);

/* --- Provider ------------------------------------------------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('jwt'),
  );
  const [user, setUser] = useState<UserPayload | null>(() =>
    token ? jwtDecode<UserPayload>(token) : null,
  );

  /* ---- LOGIN NOW USES API_BASE ------------------------------ */
  const login = async (
    email: string,
    password: string,
  ): Promise<UserPayload> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || 'Invalid credentials');
    }

    const { access_token } = await res.json();
    localStorage.setItem('jwt', access_token);
    setToken(access_token);

    const decoded = jwtDecode<UserPayload>(access_token);
    setUser(decoded);
    return decoded;
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
  };

  /* optional: refresh profile on page reload */
  useEffect(() => {
    if (!token) return;
    // e.g. fetch(`${API_BASE}/customer/me`) ...
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
