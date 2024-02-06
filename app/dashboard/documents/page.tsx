import React from 'react';
import { lusitana } from '@/app/ui/fonts';


import { BlobProvider } from '@react-pdf/renderer'


const DocumentationPage = () => {
  return (
    <div>
      <header>
        <h1 className={`${lusitana.className} text-3xl   items-full `}style={{  margin:  "10px"}}>Documentation</h1>
        
      </header>

      <section className={`${lusitana.className} text-1xl text-justify `} style={{  margin:  "10px"}} >
        <h2 className='mt-10 mb-2'><strong>Overview</strong></h2>
        <p className='mt-5 mb-2' >Public permissioned blockchains are a type of distributed ledger technology that aims to bring some of the benefits of decentralization to traditional systems of public administration in lower trust environments. Main benefits include increased participation in the democratic process and reduced risk of corruption. These characteristics can be enhanced using FAIR principles, where systems can facilitate transparency, accountability, and collaboration, improving the efficiency and effectiveness of a wide range of government processes and operations, whose sources and outputs become more easily Findable, Accessible, Interoperable, and Reusable by the civic community.</p>
        <p className='mt-5 mb-2'>Transactions on such systems are recorded in a tamper-evident manner, making it easy for citizens to view and verify the accuracy of their records. This can help build trust between the government and the public, as well as reduce the risk of fraud. Another advantage of public permissioned blockchains is that they can improve efficiency compared to traditional databases. By automating certain processes and reducing the need for manual intervention, a blockchain-based system can help to streamline the work of government agencies and reduce the risk of human errors.</p>
        <p className='mt-5 mb-2'>The AmazonChain Carbon Market Dapp will explore the creation of such a public permissioned blockchain template, distributable according to the FAIR principles, that will be applied on a case study focusing on deforestation in the Amazon rainforest, shared by a number of countries where government oversight of land right enforcement can be limited. As part of a transparent and sustainable governmental land governance practice that ensures indigenous land rights protection, the proposed blockchain template aims to track deforestation rates in a protected indigenous area. The technical framework emulates a Payment for Ecosystem Services scheme and is based on the application of smart contracts and AI on publicly available satellite data. Funds to local communities are released in the form of a carbon credit-backed native token financing a simulated Voluntary Carbon Market, after assessing the engaged communities’ performance on contracted environmental services, against the counterfactual evolution of deforestation within comparable non-protected indigenous and non-indigenous land.</p>

      </section>

      <section className={`${lusitana.className} text-1xl  `} style={{  margin:  "10px"}} >
        <h2 className='mt-10 mb-2'><strong>GitHub Repository</strong></h2>
        <p>Explore the source code and contribute to the project on GitHub <a className="md:text-green-600" href="https://github.com/chrisdaoulas/AmazoniaCoin" target="_blank" rel="noopener noreferrer">here.</a></p>

      </section>

      <section className={`${lusitana.className} text-1xl  `} style={{  margin:  "10px"}} >
      <h2 className='mt-10 mb-2'><strong>Whitepaper</strong></h2>
        <p>Read our whitepaper for more in-depth information about AmazonasCoin <a className="md:text-green-600" 
        href="https://github.com/chrisdaoulas/AmazoniaCoin/blob/main/public/pdf/whitepaper.pdf" target="_blank" rel="noopener noreferrer">here.</a></p>

      </section>

      <section className={`${lusitana.className} text-1xl  `} style={{  margin:  "10px"}}>
        <h2 className='mt-10 mb-2'><strong>Installation</strong></h2>
        <p>Include instructions on how to install and set up the project. Use code snippets where necessary.</p>
      </section>

    <section className={`${lusitana.className} text-1xl  `} style={{  margin:  "10px"}}>
        <h2 className='mt-10 mb-2'><strong>Usage Examples</strong></h2>
        <p>Illustrate how to use the project with examples and code snippets.</p>
    </section>

    <section className={`${lusitana.className} text-1xl  `} style={{  margin:  "10px"}}>
        <h2 className='mt-10 mb-2'><strong>Contacts at Universite Libre de Bruxelles</strong></h2>
        <p>christos.daoulas@ulb.be</p>
        <p>dimitrios.sacharidis@ulb.be</p>
    </section>
    </div>
  );
};

export default DocumentationPage;