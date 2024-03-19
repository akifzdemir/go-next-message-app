"use client";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { FC, ReactNode, createContext, useContext, useReducer } from "react";

type AuthState = {
  isLoggedIn: boolean;
  username: string;
};

type ActionType = {
  type: "LOGIN" | "LOGOUT";
  payload?: any;
};

type ContextType = {
  state: AuthState;
  dispatch: React.Dispatch<ActionType>;
};

const initialState: AuthState = {
  isLoggedIn:
    typeof window !== "undefined" && localStorage.getItem("jwt-token")
      ? true
      : false,
  username: "",
};

const AuthContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type CustomJwtPayload = JwtPayload & { username: string };

const reducer = (state: AuthState, action: ActionType) => {
  switch (action.type) {
    case "LOGIN":
      const token = action.payload;
      localStorage.setItem("jwt-token", token);
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      return {
        ...state,
        isLoggedIn: true,
        name: decodedToken.username,
      };
    case "LOGOUT":
      localStorage.removeItem("jwt-token");
      return {
        ...state,
        isLoggedIn: false,
        name: "",
      };

    default:
      return state;
  }
};

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
