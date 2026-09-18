'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { api, type User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    name: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      // Try to load cached user data from session storage first
      const cachedUser = sessionStorage.getItem('cached_user');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          if (!cancelled) setUser(parsedUser);
          setLoading(false);
          
          // Still refresh in background to ensure data is fresh
          api.getMe().then(me => {
            if (!cancelled) {
              setUser(me);
              sessionStorage.setItem('cached_user', JSON.stringify(me));
            }
          }).catch(() => {
            // If refresh fails, keep using cached data
          });
          return;
        } catch {
          // If parsing fails, continue with API call
        }
      }

      try {
        const me = await api.getMe();
        if (!cancelled) {
          setUser(me);
          sessionStorage.setItem('cached_user', JSON.stringify(me));
        }
      } catch {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('cached_user');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login({ email, password });
      localStorage.setItem('auth_token', res.token);
      setUser(res.user);
      sessionStorage.setItem('cached_user', JSON.stringify(res.user));
    },
    [],
  );

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      const res = await api.register({ email, name, password });
      localStorage.setItem('auth_token', res.token);
      setUser(res.user);
      sessionStorage.setItem('cached_user', JSON.stringify(res.user));
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('cached_user');
    setUser(null);
  }, []);

  // Render children immediately — don't block on the auth check.
  // Pages that need auth can read `loading` / `user` themselves.
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
