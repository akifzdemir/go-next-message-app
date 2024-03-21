"use client";
import { JwtPayload, jwtDecode } from "jwt-decode";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

type AuthState = {
  isLoggedIn: boolean;
  username: string;
  userId: string;
};

type ActionType = {
  type: "LOGIN" | "LOGOUT" | "SET_INITIAL";
  payload?: any;
};

type ContextType = {
  state: AuthState;
  dispatch: React.Dispatch<ActionType>;
};

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
  userId: "",
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

type CustomJwtPayload = JwtPayload & { username: string; userId: string };

const reducer = (state: AuthState, action: ActionType) => {
  switch (action.type) {
    case "LOGIN":
      const token = action.payload;
      localStorage.setItem("jwt-token", token);
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      return {
        ...state,
        isLoggedIn: true,
        username: decodedToken.username,
        userId: decodedToken.userId,
      };
    case "LOGOUT":
      localStorage.removeItem("jwt-token");
      return {
        ...state,
        isLoggedIn: false,
        username: "",
        userId: "",
      };
    case "SET_INITIAL":
      return {
        ...state,
        isLoggedIn: true,
        username: action.payload?.username,
        userId: action.payload?.userId,
      };

    default:
      return state;
  }
};

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      dispatch({
        type: "SET_INITIAL",
        payload: {
          username: decodedToken.username,
          userId: decodedToken.userId,
        },
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
