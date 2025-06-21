import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';   // ✅ CORRECT import

/* --- Types ---------------------------------------------------------- */
interface UserPayload {
  id: number;
  email: string;
  role: string;          // admin | buyer
}

interface AuthContextShape {
  user  : UserPayload | null;
  token : string | null;
  /*  login now returns the decoded user  */
  login : (email: string, password: string) => Promise<UserPayload>;
  logout: () => void;
}

/* --- Context -------------------------------------------------------- */
const AuthContext = createContext<AuthContextShape>(null!);
export const useAuth = () => useContext(AuthContext);

/* --- Provider ------------------------------------------------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt'));
  const [user , setUser ] = useState<UserPayload | null>(() =>
    token ? jwtDecode<UserPayload>(token) : null
  );

  /* ---- LOGIN NOW RETURNS UserPayload ------------------------------ */
  const login = async (email: string, password: string): Promise<UserPayload> => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');

    const { access_token } = await res.json();
    localStorage.setItem('jwt', access_token);

    const decoded = jwtDecode<UserPayload>(access_token);
    setToken(access_token);
    setUser(decoded);
    return decoded;                             // 👉  return for callers
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
  };

  /* optional: refresh profile on page reload */
  useEffect(() => {
    if (!token) return;
    // could call /customer/me here if you need fresh data
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
