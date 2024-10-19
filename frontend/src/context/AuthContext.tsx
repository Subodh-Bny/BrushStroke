"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import toast from "react-hot-toast";
// import { useLogout } from "@/services/api/authApi";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | undefined;
  token: string | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: undefined,
  token: undefined,
  setUser: () => {},
  setToken: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const router = useRouter();
  // const { mutate: logoutMutate } = useLogout();

  useEffect(() => {
    const userToken = Cookies.get("jwt");
    // console.log(userToken);
    if (userToken) {
      setIsLoggedIn(true);
      setToken(userToken);

      const userData = Cookies.get("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logout = () => {
    // logoutMutate();
    Cookies.remove("jwt");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setToken(undefined);
    setUser(undefined);
    router.push(routes.landing.home);

    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        setUser,
        setIsLoggedIn,
        token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
