'use client'
import React from 'react';
import { lusitana } from '@/app/ui/fonts';
import { useLoadScript, GoogleMap, MarkerF,PolygonF } from '@react-google-maps/api';
import { useMemo } from 'react';



export default function Page() {    

   
    const libraries = useMemo(() => ['places'], []);

    const mapCenter = useMemo(
        () => ({ lat: 2.14767, lng: -63 }),
        []
    );





    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, //"AIzaSyDmOnsV-JmnpIjilgkqzghEFOYTJAvFKKw",
        libraries: libraries as any,
    });

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
        disableDefaultUI: false,
        clickableIcons: true,
        scrollwheel: true,
        mapTypeId: isLoaded? google.maps.MapTypeId.HYBRID: undefined,
        labels: true,
        styles: isLoaded? [
            {
              featureType: 'all',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
          ]
        : undefined,
       
 
        }),
        [isLoaded]
    ); 

    if (!isLoaded) {
        
        return <p>Loading...</p>;
    }

    const loadKmlLayer = (map) => {
        const kmlUrl = "https://gateway.pinata.cloud/ipfs/QmXQDaAk6RkmDWuefL6H4EGJp9F9hpoRq6BkfqWaR75XPm";
        const kmlLayer = new window.google.maps.KmlLayer({
          url: kmlUrl,
          map:map,
          suppressInfoWindows: false,  
          preserveViewport: true 
          

        });
    
        kmlLayer.addListener('click', (event) => {
            
          console.log('KML Layer clicked', event);
        });

        kmlLayer.set('options', {
            preserveViewport: true,
            suppressInfoWindows: true,
            clickable: false,
            zIndex: 1,
            strokeColor: '#00FF00', // Green color
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00FF00', // Green color
            fillOpacity: 0.35,
          });
      };
    
    
    return (
      <div className="w-full ">
  
        <div className=" text-justify ">
          <h2 className={`${lusitana.className} text-2xl  items-full`} ><strong>Yanomami Project</strong></h2>
   
  
          <h3 className={`${lusitana.className} text-1xl mt-5 mb-2  `}><strong>Description</strong></h3>
          <p className={`${lusitana.className} text-1xl mt-5 mb-2  `}>

          The Yanomami tribe, numbering approximately 35,000 individuals, occupies an extensive territory spanning approximately 9.6 million hectares within the Amazon basin, straddling the borders of Brazil and Venezuela. Their ancestral lands encompass some of the most biodiverse and ecologically rich areas of the Amazon rainforest. This region serves as a critical habitat for countless plant and animal species, including rare and endangered ones. The Yanomami`s deep understanding of their environment, acquired through centuries of living in harmony with nature, enables them to act as effective stewards of the land.          </p>
  
          <p className={`${lusitana.className} text-1xl mt-5 mb-2  `}>
          Their efforts in protecting this vast territory hold immense significance in the global fight against climate change. The Amazon rainforest, often referred to as the `lungs of the planet`, plays a crucial role in regulating the Earth`s climate by absorbing carbon dioxide from the atmosphere. It is estimated that the Amazon absorbs approximately 2.2 billion metric tons of CO2 annually, mitigating the impacts of greenhouse gas emissions and helping to stabilize the global climate.

          </p>

        <p className={`${lusitana.className} text-1xl mt-5 mb-2  `}>
          The Yanomami`s resistance against external threats such as illegal logging, mining, and land encroachment has been instrumental in preserving the integrity of their ancestral territory. By actively opposing these destructive activities, the Yanomami protect not only their own way of life but also safeguard vital ecosystems and biodiversity. Their efforts have contributed to maintaining the Amazon rainforest as a stronghold of biodiversity, with their land containing an estimated 12% of the world`s plant and animal species.
          </p>

          <p className={`${lusitana.className} text-1xl mt-5 mb-2  `}>
          Furthermore, the Yanomami`s advocacy has led to significant strides in the recognition of indigenous land rights and the establishment of protected areas. Their activism on local, national, and international levels has raised awareness about the importance of indigenous land tenure for the conservation of the Amazon and the mitigation of climate change. Through their resilience, determination, and deep-rooted connection to the land, the Yanomami tribe serves as a powerful force in the ongoing efforts to protect the Amazon rainforest and combat the existential threat of climate change on a global scale.          </p>

          



          <section className={`${lusitana.className} text-1xl mt-5 mb-2 `} >
            
            
            <p className='mb-5'>AmazoniaCoin plays a crucial role in supporting the Payment for Ecosystem Services (PES) Yanomami project by leveraging blockchain technology and creating a carbon credit market. Here`s how AmazoniaCoin contributes to the success of the project, by safeguarding the sustainability and protection of the Yanomami indigenous people`s territory:</p>
  
            
            
            <ul>
              <p className='mb-2'><strong>1 .Transparent and Traceable Transactions</strong></p>
              <ul>  
                <li className='mb-5'>AmazoniaCoin utilizes blockchain technology to create a transparent and traceable system for recording transactions related to carbon credits. The decentralized and tamper-evident nature of the blockchain ensures the integrity of the data, providing a trustworthy platform for all stakeholders involved.</li>
                
              </ul>

              <p className='mb-2'><strong>2. Decentralized Tracking of Deforestation</strong></p>
              <ul>  
                <li className='mb-5'> Through the implementation of smart contracts and artificial intelligence (AI) on publicly available satellite data, AmazoniaCoin facilitates the tracking of deforestation rates in protected indigenous areas. The decentralized nature of the blockchain ensures tamper-evident transactions, allowing for trustworthy and accurate recording of environmental data.</li>                
              </ul>
    
              <p className='mb-2'><strong>3. Carbon Credit Generation</strong></p>
              <ul >
                <li className='mb-5'>The Yanomami project involves protecting a vast expanse of Amazon Rainforest, which acts as a significant carbon sink. Through the implementation of smart contracts on the blockchain, AmazoniaCoin facilitates the generation and certification of carbon credits based on the amount of carbon sequestered by the protected forest. This process is crucial for participating in carbon offset programs.</li>
              </ul>

              <p className='mb-2'><strong>4. Native Token Backing</strong></p>
              <ul >
                <li className='mb-5'>AmazoniaCoin`s native token backed by carbon credits serves as the currency within the blockchain-based carbon credit market. Each token represents a quantifiable amount of carbon offset redeemed by sponsors funding ecosystem projects with the Yanomami as beneficiaries, allowing for a standardized and tradable unit that can be exchanged on the market.</li>
              </ul>

              <p className='mb-2'><strong>5. Simulated Voluntary Carbon Market</strong></p>
              <ul >
                <li className='mb-5'>The blockchain-based carbon credit market operates as a simulated Voluntary Carbon Market. This market enables buyers, such as companies and individuals, to purchase carbon credits from the Yanomami project. The funds generated from these transactions contribute to the financial sustainability of the Yanomami indigenous people and support their efforts in preserving the rainforest.</li>
              </ul>

              <p className='mb-2'><strong>6. Funds Allocation to Local Communities</strong></p>
              <ul >
                <li className='mb-5'>As part of the Payment for Ecosystem Services scheme, AmazoniaCoin ensures that funds from the sale of carbon credits are allocated to the local communities, specifically the Yanomami people. The disbursement of funds is contingent on the communities` performance in providing contracted environmental services, such as preventing deforestation within their protected territory.</li>
              </ul>

              
              <p className='mb-2'><strong>7. Indigenous Land Rights Protection</strong></p>
              <ul >
                <li className='mb-5'>The blockchain template employed by AmazoniaCoin guarantees transparent governmental land governance. This is especially important for safeguarding the indigenous land rights of the Yanomami people. The decentralized and publicly accessible nature of the blockchain ensures that land governance practices are accountable and free from external interference.</li>
              </ul>

              <p className='mb-2'><strong>8. Efficiency and Automation</strong></p>
              <ul >
                <li className='mb-10'>By automating processes and leveraging blockchain technology, AmazoniaCoin streamlines the administration of the carbon credit market. This efficiency minimizes the need for manual intervention, reducing the risk of errors and ensuring the fair distribution of funds.</li>
              </ul>
    
              <p className='mb-5'>AmazoniaCoin acts as a catalyst for sustainable governance by combining blockchain technology, carbon credits, and smart contracts to protect indigenous land rights, track deforestation, and allocate funds based on environmental performance. The creation of a blockchain-based carbon credit market not only provides financial incentives for the preservation of the Amazon Rainforest but also establishes a model for transparent and accountable environmental governance. As such, the innovative approach of AmazoniaCoin contributes to the preservation of the Yanomami territory, fostering a balance between economic development and ecological conservation.</p>
  
            </ul>            
          </section>

          <GoogleMap
            options={mapOptions}
            zoom={8}
            center={mapCenter}
            mapTypeId={google.maps.MapTypeId.SATELLITE}
            mapContainerStyle={{ width: '100%', height: '500px', margin: "auto" }}
            onLoad={(map) => {
                
                loadKmlLayer(map)
                console.log('Map Loaded')
                
                }}
                >

            <MarkerF
                position={mapCenter}
                onLoad={() => console.log('Marker Loaded')}  
            />
        </GoogleMap>


          <a href ="./">
            <button className={"`${lusitana.className} mt-5 mb-2 flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"} type="button"
        
                >
                Back
            </button>
        </a>
        </div>
      </div>
      

        );
  }; 