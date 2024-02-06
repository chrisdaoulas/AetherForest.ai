'use client'

import Head from 'next/head';
import { lusitana } from '../../ui/fonts';
import { Spacer } from '@chakra-ui/react';



export default function Home() {
    return (
      <div className=" text-justify "  >
      
        
         <Head>
            <title className={`${lusitana.className} text-3xl `}>AmazonasCoin - Blockchain for Sustainable Governance</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>  
        
          <h1 className={`${lusitana.className} text-3xl   items-full `}style={{  margin:  "10px"}} >Welcome to AmazonasCoin</h1>
          <h2 className={`${lusitana.className} text-2xl  items-full`} style={{  margin:  "10px"}}>An Open Permissioned ReFi Carbon Market Blockchain Template</h2>


        <section className={`${lusitana.className} text-1xl  `} style={{  margin:  "10px"}}  >
            
          <h2 className='mt-10 mb-2'><strong>Unlocking the Potential of Public Permissioned Blockchains for Sustainable Governance</strong></h2>
          <p className='mb-10'>AmazonasCoin introduces a groundbreaking initiative in the realm of blockchain technology, specifically tailored for public permissioned blockchains. Our mission is to harness the power of decentralization to enhance public administration, especially in regions with lower trust environments. By integrating Open Data and FAIR principles — promoting systems that are Findable, Accessible, Interoperable, and Reusable — AmazonasCoin aims to usher in a new era of transparency, accountability, and collaboration in government processes.</p>

          
          <h3 className='mb-2' ><strong>Key Features and Benefits</strong></h3>
          <ul>
            <p className='mb-2'><strong>1. Decentralization for Democracy</strong></p>
            <ul role="list" className="list-disc pl-5 ">  
              <li>Increased Participation: AmazonasCoin empowers citizens by fostering increased participation in the democratic process.</li>
              <li className='mb-5'>Reduced Corruption Risk: By employing decentralized technology, we mitigate the risk of corruption, ensuring fair and transparent governance.</li>
            </ul>
  
            <p className='mb-2'><strong>2. Tamper-Evident Transactions</strong></p>
            <ul role="list" className="list-disc pl-5 ">
              <li className='mb-5'>Trust and Verification: Our tamper-evident transaction recording ensures citizens can easily view and verify the accuracy of their records, fostering trust between the government and the public.</li>
            </ul>
  
            <p className='mb-2'><strong>3. Efficiency and Automation</strong></p>
            <ul role="list" className="list-disc pl-5 ">
              <li>Streamlined Government Operations: AmazonasCoin enhances efficiency by automating processes and minimizing the need for manual intervention.</li>
              <li className='mb-10'>Error Reduction: The blockchain-based system reduces the risk of human errors, making government agencies more effective.</li>
            </ul>

          </ul>            
        </section>
  
        <section className={`${lusitana.className} text-1xl `} style={{  margin:  "10px"}}>
          <h2 className='mb-2'><strong>The AmazonChain Carbon Market Dapp</strong></h2>
          <p className='mb-5'>In a pioneering effort to apply public permissioned blockchain technology, we present the AmazonChain Carbon Market Dapp. This initiative focuses on a case study addressing deforestation in the Amazon rainforest, a shared concern across multiple countries. In regions where government oversight of land rights enforcement is limited, AmazonChain steps in as a transparent and sustainable solution.</p>
  
          <h3 className='mb-2'><strong>Project Highlights</strong></h3>
          <ul>
            <li className='mb-2'><strong>Indigenous Land Rights Protection</strong></li>
            <ul role="list" className="list-disc pl-5 ">
              <li>Ensuring Transparency: Our blockchain template guarantees transparent governmental land governance, safeguarding indigenous land rights.</li>
              <li className='mb-5'>Deforestation Tracking: Using smart contracts and AI on publicly available satellite data, we track deforestation rates in protected indigenous areas.</li>
            </ul>
  
            <li className='mb-2'><strong>Payment for Ecosystem Services Scheme</strong></li>
            <ul role="list" className="list-disc pl-5 ">
              <li>Carbon Credit-Backed Native Token: AmazonasCoin introduces a native token backed by carbon credits, facilitating a simulated Voluntary Carbon Market.</li>
              <li className='mb-10'>Funds Allocation: Local communities receive funds based on their performance in providing contracted environmental services, fostering sustainability.</li>
            </ul>
          </ul>
        </section>
  
        <footer className={`${lusitana.className} text-1xl `} style={{  margin:  "10px"}}>
          <p className='mb-2'><strong>Join Us in Building a Sustainable Future!</strong></p>
          <p className='mb-2'>AmazonasCoin invites you to be part of this transformative journey towards sustainable governance. By leveraging blockchain technology, we envision a future where accountability, transparency, collaboration, and environmental stewardship go hand in hand.</p>
          <p>Explore AmazonasCoin and contribute to a world where blockchain empowers positive change.</p>
        </footer>
      </div>
    
    );
  }