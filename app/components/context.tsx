'use client'
import React, { createContext, Component, useState, useMemo, useEffect } from "react";

import { defaultUser } from "./defaults";
import { User } from './types'
import { localStorageManager } from "@chakra-ui/react";


export const UserContext = createContext({
  user: defaultUser,
  //addUser: (user: User) => { }
  addUser: (user: User, callback?: (prevUser: User) => User) => { }

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

  const context = {
    user,
    addUser: addUserHandler,
  };


  function getInitialState() {
    if (typeof window !== 'undefined') {
      // Check if the code is running in a browser environment
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : [];
    } else {
      // Handle the case when running on the server or in a non-browser environment
      return [defaultUser];
    }
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

