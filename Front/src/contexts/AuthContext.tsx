
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

interface User {
  id: number;
  role: string;
  nom?: string;
  prenom?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing token on app load
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Parse the JWT token to get user info
          const payload = JSON.parse(atob(storedToken.split(".")[1]));
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            setUser({
              id: payload.id,
              role: payload.role,
              nom: payload.nom,
              prenom: payload.prenom,
              email: payload.email,
            });
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        // Parse the JWT token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.id,
          role: payload.role,
          nom: payload.nom,
          prenom: payload.prenom,
          email: payload.email,
        });
        localStorage.setItem("token", token);
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    toast({
      title: "Connexion réussie",
      description: "Bienvenue dans votre espace CRM",
    });
    
    // Redirect to intended page or dashboard
    const intendedPath = location.state?.from?.pathname || "/dashboard";
    navigate(intendedPath, { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
