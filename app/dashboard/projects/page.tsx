'use client'
import React from 'react';
import Image from 'next/image';
import kayapo from '@/public/kayapo.jpg';
/*import yanomami from '@/public/yanomami.jpg';*/
import { lusitana } from '@/app/ui/fonts';
import brazil from '@/public/brazil.svg';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-3xl`}>AmazoniaCoin PES Projects</h1>
      <div className="flex w-full mt-5 mb-2 justify-between">
        <div className="w-1/2 mt-6">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="text-justify" style={{ textAlign: 'left', maxWidth: '350px', margin: 'auto' }}>
              <Image src={kayapo} alt="Kayapo Project" style={{ width: '100%', borderRadius: '8px 8px 0 0' }} />
              <div className="text-justify" style={{ padding: '20px', background: '#fff', borderRadius: '0 0 8px 8px' }}>
                <h2 className={`${lusitana.className} text-2xl items-full`} ><strong>Kayapo Project</strong></h2>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  <span className={`${lusitana.className} text-1xl mt-5 mb-2`} role="img" aria-label="Brazil Flag">
                    <Image className='mt-5 mb-2' src={brazil} alt="Kayapo Project" style={{ width: '11%', borderRadius: '0px 0px 0 0' }} />
                  </span>{' '}
                  Brazil
                </p>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  The Kayapo indigenous people safeguard over 9 million hectares (22 million acres) of the Amazon Rainforest, an expanse equivalent to Portugal. With a commitment to their traditional way of life, they resist large-scale deforestation, protecting their territory—a biodiversity haven. The ~8,000 Kayapó preserve an area akin to Portugal or South Korea, primarily composed of primary forest with patches of savannah on Brazilian shield bedrock. This territory fosters diverse species like white-lipped peccary, tapir, giant armadillo, giant otter, giant anteater, jaguar, hyacinth macaw, harpy eagle, white-whiskered spider monkey, and saki monkey, facing threats elsewhere.
                </p>
                <Link href="./projects/kayapo">
                  <button className={`${lusitana.className} mt-5 mb-2 flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`} type="button">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 mt-6">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="text-justify" style={{ textAlign: 'left', maxWidth: '350px', margin: 'auto' }}>
              <Image src={kayapo} alt="Yanomami Project" style={{ width: '100%', borderRadius: '8px 8px 0 0' }} />
              <div className="text-justify" style={{ padding: '20px', background: '#fff', borderRadius: '0 0 8px 8px' }}>
                <h2 className={`${lusitana.className} text-2xl items-full`} ><strong>Yanomami Project</strong></h2>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  <span className={`${lusitana.className} text-1xl mt-5 mb-2`} role="img" aria-label="Brazil Flag">
                    <Image className='mt-5 mb-2' src={brazil} alt="Yanomami Project" style={{ width: '11%', borderRadius: '0px 0px 0 0' }} />
                  </span>{' '}
                  Brazil
                </p>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  The Yanomami indigenous people safeguard over 9 million hectares (22 million acres) of the Amazon Rainforest, an expanse equivalent to Portugal. With a commitment to their traditional way of life, they resist large-scale deforestation, protecting their territory—a biodiversity haven. The ~8,000 Yanomami preserve an area akin to Portugal or South Korea, primarily composed of primary forest with patches of savannah on Brazilian shield bedrock. This territory fosters diverse species like white-lipped peccary, tapir, giant armadillo, giant otter, giant anteater, jaguar, hyacinth macaw, harpy eagle, white-whiskered spider monkey, and saki monkey, facing threats elsewhere.
                </p>
                <Link href="./projects/yanomami">
                  <button className={`${lusitana.className} mt-5 mb-2 flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`} type="button">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
