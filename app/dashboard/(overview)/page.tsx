'use client'

/* import {Card} from '@/app/ui/dashboard/cards';
import { Suspense } from 'react';
//import { fetchCardData } from '@/app/lib/data';
import CardWrapper from '@/app/ui/dashboard/cards';
import { CardsSkeleton,InvoiceSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import RevenueChart from '../../ui/dashboard/revenue-chart';
import LatestInvoices from '../../ui/dashboard/latest-invoices';
import { lusitana } from '../../ui/fonts';
//import { fetchLatestInvoices } from '../../lib/data'; */
import Head from 'next/head';
import { lusitana } from '../../ui/fonts';
import { Spacer } from '@chakra-ui/react';

/* export default async function Page(){

    //const latestInvoices = await fetchLatestInvoices();



    return(
        <main>
            <h1 className={'${lusitana.className} mb-4 text-xl md:text-2xl'}>
                Dashboard
            </h1>

            
{/*             <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                <Card title="Collected" value={totalPaidInvoices} type="collected" />
                <Card title="Pending" value={totalPendingInvoices} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                <Card title="Total Customers" value={numberOfCustomers} type="customers" />
            </div> ** 
            <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
                <Suspense fallback={<RevenueChartSkeleton/>}>                
                    <RevenueChart />
                </Suspense>
                <Suspense fallback = {<LatestInvoicesSkeleton/>}>
                    <LatestInvoices />
                </Suspense>
                <Suspense fallback={<CardsSkeleton/>}>
                    <CardWrapper/>
                </Suspense>
                
            </div>  
        </main>
    );
} */


export default function Home() {
    return (
      <div >
        
         <Head>
            <title className={`${lusitana.className} text-3xl `}>AmazonasCoin - Blockchain for Sustainable Governance</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>  
        
          <h1 className={`${lusitana.className} text-3xl `}style={{  margin:  "10px"}} >Welcome to AmazonasCoin</h1>
          <h2 className={`${lusitana.className} text-2xl `} style={{  margin:  "10px"}}>An Open Permissioned ReFi Carbon Market Blockchain Prototype</h2>
        
         
        <section className={`${lusitana.className} text-1xl `} style={{  margin:  "10px", padding: "20px"}} >
            
          <h2 ><strong>Unlocking the Potential of Public Permissioned Blockchains for Sustainable Governance</strong></h2>
          <p style={{  margin:  "20px" , textAlign: "justify"}}>AmazonasCoin introduces a groundbreaking initiative in the realm of blockchain technology, specifically tailored for public permissioned blockchains. Our mission is to harness the power of decentralization to enhance public administration, especially in regions with lower trust environments. By integrating FAIR principles — promoting systems that are Findable, Accessible, Interoperable, and Reusable — AmazonasCoin aims to usher in a new era of transparency, accountability, and collaboration in government processes.</p>

          
          <h3  style={{  margin:  "10px" , textAlign: "justify"}}><strong>Key Features and Benefits</strong></h3>
          <ul>
            <p><strong>1. Decentralization for Democracy:</strong></p>
            <ul>  
              <li>Increased Participation: AmazonasCoin empowers citizens by fostering increased participation in the democratic process.</li>
              <li>Reduced Corruption Risk: By employing decentralized technology, we mitigate the risk of corruption, ensuring fair and transparent governance.</li>
            </ul>
  
            <p><strong>2. Tamper-Evident Transactions:</strong></p>
            <ul>
              <li>Trust and Verification: Our tamper-evident transaction recording ensures citizens can easily view and verify the accuracy of their records, fostering trust between the government and the public.</li>
            </ul>
  
            <p><strong>3. Efficiency and Automation:</strong></p>
            <ul>
              <li>Streamlined Government Operations: AmazonasCoin enhances efficiency by automating processes and minimizing the need for manual intervention.</li>
              <li>Error Reduction: The blockchain-based system reduces the risk of human errors, making government agencies more effective.</li>
            </ul>

            </ul>
            
          


        </section>
  
        <section className={`${lusitana.className} text-1xl `} style={{  margin:  "10px"}}>
          <h2><strong>The AmazonChain Carbon Market Dapp:</strong></h2>
          <p>In a pioneering effort to apply public permissioned blockchain technology, we present the AmazonChain Carbon Market Dapp. This initiative focuses on a case study addressing deforestation in the Amazon rainforest, a shared concern across multiple countries. In regions where government oversight of land rights enforcement is limited, AmazonChain steps in as a transparent and sustainable solution.</p>
  
          <h3><strong>Project Highlights:</strong></h3>
          <ul>
            <li><strong>Indigenous Land Rights Protection:</strong></li>
            <ul>
              <li>Ensuring Transparency: Our blockchain template guarantees transparent governmental land governance, safeguarding indigenous land rights.</li>
              <li>Deforestation Tracking: Using smart contracts and AI on publicly available satellite data, we track deforestation rates in protected indigenous areas.</li>
            </ul>
  
            <li><strong>Payment for Ecosystem Services Scheme:</strong></li>
            <ul>
              <li>Carbon Credit-Backed Native Token: AmazonasCoin introduces a native token backed by carbon credits, facilitating a simulated Voluntary Carbon Market.</li>
              <li>Funds Allocation: Local communities receive funds based on their performance in providing contracted environmental services, fostering sustainability.</li>
            </ul>
          </ul>
        </section>
  
        <footer className={`${lusitana.className} text-1xl `} style={{  margin:  "10px"}}>
          <p><strong>Join Us in Building a Sustainable Future:</strong></p>
          <p>AmazonasCoin invites you to be part of this transformative journey towards sustainable governance. By leveraging blockchain technology, we envision a future where accountability, collaboration, and environmental stewardship go hand in hand.</p>
          <p>Explore AmazonasCoin and contribute to a world where blockchain empowers positive change.</p>
        </footer>
      </div>
    
    );
  }