'use client'
import { createContext, useContext, ReactNode, useReducer } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'public' | 'consortium' | 'beneficiary';
}

interface UserState {
  user: User | undefined;
}

type UserAction = { type: 'SET_USER'; payload: User | undefined };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

interface UserContextProps {
  children: ReactNode;
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: { user: undefined },
  dispatch: () => {},
});

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, { user: undefined });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
