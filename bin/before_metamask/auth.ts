
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { useContext } from 'react';
import { UserContext } from './app/components/context';
//import { useUser, determineUserRole } from './app/login/user';




export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  }

  catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {



      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string() })
        .safeParse(credentials);

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const userdeets = await getUser(email);
        if (!userdeets) return null;
      

        //const passwordsMatch = password===user.password;
        const passwordsMatch = await bcrypt.compare(password, userdeets.password);
        

        if (passwordsMatch){


          console.log(userdeets)
          return userdeets;
         //const { id, ...userWithoutId } = userdeets;
         //console.log(userWithoutId);
         //return userWithoutId;

        } 

      }
        const credentialsSchema = z.object({ email: z.string().email(), password: z.string() });
        
        console.log('Invalid credentials according to the schema:',credentialsSchema);
        return null;
      },
  }),
  ],
})