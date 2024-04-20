'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  TrophyIcon,
  CakeIcon,
  CalculatorIcon,
  DocumentIcon,
  WalletIcon
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
//import { useUser, UserProvider } from '@/app/login/user';
import React, { useState, useEffect, useContext } from 'react';
//import { useUser } from '@/app/components/UserContext';

import {UserContext} from '@/app/components/context';
import Provider from '@/app/components/context';
import { getrole } from '@/app/lib/actions';




// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Blockchain', href: '/dashboard/blockchain', icon: DocumentDuplicateIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: UserGroupIcon },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ShoppingCartIcon },
  //{ name: 'Invoices', href: '/dashboard/invoices', icon: WalletIcon },
  { name: 'Carbon Credits', href: '/dashboard/carbon_credit_flow', icon: TrophyIcon },
  { name: 'Metrics', href: '/dashboard/metrics', icon: CalculatorIcon },
  { name: 'User AOI', href: '/dashboard/user_aoi', icon: WalletIcon },
  { name: 'Documentation', href: '/dashboard/documents', icon: DocumentIcon },

];




const NavLinks: React.FC = () => {

  const { user,addUser } = useContext(UserContext);

   const [role, setRole] = useState<string>('');

  useEffect(() => {
    
    const fetchRole = async () => {
      try {
        const role = await getrole(user?.email);
        setRole(role);
        addUser({
          role:role,
          email: user.email,
          password: user.password
        })
      } catch (error) {
        console.error('Error:', error);
      }
    };

   
    fetchRole();
  }, []);  



  console.log('User Role:', user?.role)
  

  const filteredLinks = links.filter((link) => {
    return !(user?.role === 'Public' && link.name === 'Transactions');
  });

  const pathname = usePathname();

  return (
    <Provider>
      <>
        {filteredLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3", {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </>
    </Provider>
  ); 

}

export default NavLinks;

