import Web3 from "web3";

export type User  ={
    role: string| null;
    email: string | null;
    password: string | null;
    //updateState?: (callback: (prevUser: User) => User) => void;
}

export type Web3State = {
    web3:  Web3 | null;
    account: string | null
  };


