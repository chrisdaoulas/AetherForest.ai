'use client'

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import {  useFormState, useFormStatus } from 'react-dom';
import useClient from 'react-dom/client'
import { authenticate } from '@/app/lib/actions';
import React, { useState, useEffect, useContext } from 'react';
import {UserContext} from '@/app/components/context';
import { getrole } from '@/app/lib/actions';







//export default function LoginForm() {
  const LoginForm: React.FC = () => {


  const {user,addUser} = useContext(UserContext);
  const [newusername, setUsernameLocal] = useState('');
  const [newpassword, setPasswordLocal] = useState('');
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);



/*   useEffect(() => {
    const fetchUserDetails = async () => {
      if (newusername) {
        try {
          const userDeets = await getUser(newusername);
          if (userDeets) {
            setUsernameLocal(userDeets.email);
            setPasswordLocal(userDeets.password);

            addUser({
              role: userDeets.name.toString(), // Update with the correct property for user role
              email: userDeets.email.toString(),
              password: userDeets.password.toString(),
            });

            console.log('Updated user details:', userDeets);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [newusername, addUser]); */

  return (

    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setUsernameLocal(inputValue);
                  console.log('Existing user',user)                  
                }}
                onPaste={(e) => {
                  const inputValue = e.clipboardData.getData('text/plain');
                  setUsernameLocal(inputValue);
                  console.log('Existing user',user)                 
                }}
                

                required

              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setPasswordLocal(inputValue);
              
                   addUser({
                    role:  user.role,
                    email: newusername,
                    password: newpassword
                  });                  
              
                  console.log('New user', user); 
                }}


                required

                minLength={6}

                onPaste={(e) => {
                  const inputValue = e.clipboardData.getData('text/plain');
                  setPasswordLocal(inputValue);
              
                   addUser({
                    role: user.role,
                    email: newusername,
                    password: newpassword
                  });

                  console.log('New user', user); 
                }}

              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>

  );


  function LoginButton() {

    const { pending } = useFormStatus();

    return (

      <Button 
        className="mt-4 bg-green-500 w-full" aria-disabled={pending}>
        Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
    );
  }
};


export default LoginForm;