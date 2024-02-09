import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { useUser } from './app/login/user';




async function getUser(email: string): Promise<User | undefined> {
  try {

    const { dispatch } = useUser();

    //const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    const userQueryResult = await sql<User>`SELECT * FROM users WHERE email=${email}`;

    // Ensure that the queryResult is not empty
    if (userQueryResult.rows && userQueryResult.rows.length > 0) {
      const user = userQueryResult.rows[0];

      const updatedUser = {
        ...user,
        role: determineUserRole(user.name.toString()),
      };
    

      dispatch({ type: 'SET_USER', payload: updatedUser });

    //return user.rows[0];
    return userQueryResult.rows[0];
  }}     

   catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

function determineUserRole(name: string): 'public' | 'consortium' | 'beneficiary' {
  if (name === 'Public') {
    return 'public';
  } else if (name === 'Consortium') {
    return 'consortium';
  } else if (name === 'Beneficiaries') {
    return 'beneficiary';
  }

  return 'public';

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
        const user = await getUser(email);
        if (!user) return null;

        //const passwordsMatch = password===user.password;
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return user;
        console.log(user.toString())

      }
      console.log('Invalid credentials');
      return null;
    },
  }),
  ],
})