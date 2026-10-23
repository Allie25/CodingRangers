import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../utils/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("cr-token"))
      authApi
        .me()
        .then(({ data }) => setUser(data.user))
        .catch(() => localStorage.removeItem("cr-token"))
        .finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const value = useMemo(
    () => ({
      user,
      loading,
      authenticate(data) {
        localStorage.setItem("cr-token", data.token);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("cr-token");
        setUser(null);
      },
    }),
    [user, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
