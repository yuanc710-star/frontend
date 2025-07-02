
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  university?: string;
  businessName?: string;
  businessType?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { userType: string; name: string; businessName?: string; businessType?: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth on load
    const storedUser = localStorage.getItem("campus-tours-user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const userData: User = {
      id: "user-123",
      name: email.split("@")[0].replace(".", " ").split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
      email,
      userType: "prospective",
      university: "Stanford University"
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("campus-tours-user", JSON.stringify(userData));
  };

  const signUp = async (email: string, password: string, userData: { userType: string; name: string; businessName?: string; businessType?: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email,
      userType: userData.userType,
      businessName: userData.businessName,
      businessType: userData.businessType
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("campus-tours-user", JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("campus-tours-user");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
