'use client'
import React, { createContext, Component, useState, useMemo, useEffect } from "react";

import { defaultUser } from "./defaults";
import { User } from './types'
import { localStorageManager } from "@chakra-ui/react";


export const UserContext = createContext({
  user: defaultUser,
  addUser: (user: User) => { }

})

// Then create a provider Component
export function Provider(props: any) {

  //const [user, setUser] = useState<User>(defaultUser);
  const [user, setUser] = useState<User>(getInitialState);

  function addUserHandler(user: User) {
    setUser(() => {
      return user;
    });
  };

/*   const context = useMemo(() => {
    return { user, addUser: addUserHandler };
  }, [user, addUserHandler]);

 */
  const context = {
    user,
    addUser: addUserHandler,
  };

  function getInitialState() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : []
  }

  useEffect(() => {

    if (user !== defaultUser) {

      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);


  return (
    <UserContext.Provider
      value={context}
    >
      {props.children}
    </UserContext.Provider>
  );
  //}
}

export default Provider;


/* 'use client'
import { useEffect, useReducer, createContext, useContext, useMemo } from "react";
import { AppReducer, initialState } from "./AppReducer";



const AppContext = createContext({
  user: defaultUser,
  setUser: (user: User) => {}
});

export function AppWrapper({ children }) {
  const { state, dispatch } = useReducer(AppReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);


  useEffect(() => {
    if (JSON.parse(localStorage.getItem("state"))) {

      //checking if there already is a state in localstorage
      //if yes, update the current state with the stored one
      dispatch({
        type: "init_stored",
        value: JSON.parse(localStorage.getItem("state")),
      });
    }
  }, []);

  useEffect(() => {
    if (state !== initialState) {

      localStorage.setItem("state", JSON.stringify(state));

      //create and/or set a new localstorage variable called "state"
    }
  }, [state]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
} */