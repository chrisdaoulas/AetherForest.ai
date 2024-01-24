import Amazoncover from '/public/Amazon_CIAT_(3).jpg';
import Amzlogo from '/public/amazoncoinlogo3-fotor-20231230105135.png';

import LoginForm from '@/app/ui/login-form';
import Image from 'next/image';

 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
          <Image src={Amzlogo} width={120} height={120} objectFit="cover" alt='AmazonCoin Logo'/>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}