'use client'
import React from 'react';
import Image from 'next/image';
import kayapo from '@/public/kayapo.jpg'
import { lusitana } from '@/app/ui/fonts';
import brazil from '@/public/brazil.svg';
import Link from 'react-router-dom';


 export default function Page() {
  return (
    <div className="w-full ">
    <h1 className={`${lusitana.className} text-3xl `}>AmazoniaCoin PES Projects</h1>
    <div className="flex w-full mt-5 mb-2 items-center justify-between">
  
    <div className="mt-6 flow-root">

      <div className="inline-block min-w-full align-middle">
 
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

    <div className=" text-justify "  style={{ textAlign: 'left', maxWidth: '350px', margin: 'auto' }}>
      <Image src={kayapo} alt="Kayapo Project" style={{ width: '100%', borderRadius: '8px 8px 0 0' }} />

      <div className=" text-justify "  style={{ padding: '20px', background: '#fff', borderRadius: '0 0 8px 8px' }}>
        <h2 className={`${lusitana.className} text-2xl  items-full`} ><strong>Kayapo Project</strong></h2>
        <p className={`${lusitana.className} text-1xl mt-5 mb-2  `}>
          <span className={`${lusitana.className} text-1xl mt-5 mb-2  `} role="img" aria-label="Brazil Flag">
          <Image className='mt-5 mb-2' src={brazil} alt="Kayapo Project" style={{ width: '11%', borderRadius: '0px 0px 0 0' }} />
          </span>{' '}
           Brazil
        </p>

        
        <p className={`${lusitana.className} text-1xl mt-5 mb-2  `}>
          The Kayapo indigenous people protect more than 9 million hectares (22 million acres) of Amazon Rainforest (roughly the size of Portugal). They continue to live within their traditional culture. They do not engage in large-scale deforestation and fight to protect their territory, one of the world's richest ecosystems, from the ravages of the outside world.
        </p>


        <a href ="./projects/kayapo">
        <button className={"`${lusitana.className} mt-5 mb-2 flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"} type="button"
        
                >
                Learn More
            </button>
        </a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
      );
}; 

/* const KayapoProject = () => {
    // Replace 'your_image_source' with the actual path or URL to your image
    //const imagePath = '/public/kayapo.jpg';
  
    return (
      <div>
        <Image src={kayapo} width={500} height={500} alt="Kayapo Project" className="hidden md:block" />
        <div>
          <h2>Kayapo Project 🇧🇷 Brazil</h2>
          <p>
            <strong>Description</strong>
          </p>
          <p>
            The Kayapo indigenous people protect more than 9 million hectares (22 million acres) of Amazon Rainforest
            (roughly the size of Portugal). They continue to live within their traditional culture. They do not engage in
            large scale deforestation and fight to protect their territory, one of the world's richest ecosystems, from the
            ravages of the outside world.
          </p>
          <p>
            The area protected by the ~8,000 Kayapó is roughly equal in size to Portugal or South Korea. This area is
            comprised mostly of primary forest interspersed with a few patches of naturally occurring savanna growing on
            Brazilian shield bedrock. Kayapo territory is a biodiversity paradise providing sufficient size habitat for
            sensitive species which are threatened or extirpated in other areas including; white-lipped peccary, tapir,
            giant armadillo, giant otter, giant anteater, jaguar, hyacinth macaw, harpy eagle, white whiskered spider monkey,
            and saki monkey.
          </p>
        </div>
      </div>
    );
  };
  
  export default KayapoProject;

 */
