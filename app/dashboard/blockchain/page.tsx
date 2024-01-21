// pages/index.js or your Next.js component

'use client'
import { useEffect, useState} from 'react';
import {Web3} from 'web3';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';


//import ethers from 'ethers';
import CarbonChainJSON from '@/src/artifacts/contracts/amazoncoin.sol/CarbonChain.json';





//Possible options for getPastEvents: 
//LogIndex, transactionIndex, transactionHash, blockHash, blockNumber, 
//address, data, topics, returnValues, event, signature, raw

  //const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);

const MyComponent = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {  
  
  const web3 = new Web3('http://localhost:8545');
  const queryParam = searchParams.query || '';
  const currentPage = Number(searchParams.page) || 1;
  
  const [events, setEvents] = useState<event[]>([]);
  const [transfer, setTransfer] = useState<event[]>([]);
  const [cid, setCID] = useState<event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const router = useRouter();



  interface event {
    name: any;
    data: {
      blockNumber: number;
      // Add other properties as needed based on your event structure
      // For example, you can use the 'raw' property to access all event data
      raw: any;
    };
    number: any;
  }



  useEffect(() => {
    const init = async () => {
    // Connect to the local Ethereum node
    

    // Replace 'CarbonChain' with your contract ABI and address
     
    const contractAddress = '0x3aAde2dCD2Df6a8cAc689EE797591b2913658659';
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    
    // Get all events from the contract ABI
    const allEvents = await contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 'latest' });

    setEvents([]);

    // Subscribe to all events
    allEvents.forEach((event) => {
   
    setEvents((prevEvents) => 
        [{ name: event.event, date: event.date, data: event, number: event.blockNumber }, ...prevEvents]
    
        );
        
      });

    };

    init();
  }, [currentPage,searchQuery]);

  const filteredEvents = events.filter((event) =>
  event.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleKeyPress = () => {
  window.location.reload();
};

function dating(event){
  //return Date(Number(date)*1000);
  //return Date(date);
  //return Date(Number(date.toString())*1000);
  //return Number(date.toString())*1000;
  //date = Date(date);
  //date = Number(date.toString())*1000;
  //const date = Number(event['data']['returnValues']['timestamp'].toString())*1000;
  //const d = Date(date);
  
  //return (await web3.eth.getBlock(Number(bn.toString()))).timestamp;
  //const timestampInSeconds = 1705762650;
  //const date = Date(timestampInSeconds * 1000); // Multiply by 1000 to convert to milliseconds
  //return date;

}


 return (
  
  <div className="w-full">
    
    <h1 className={`${lusitana.className} text-3xl`}>All Events Listener</h1>
    
     <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Events..." 
           //value={searchQuery}
           //onChange={(e) => setSearchQuery(e.target.value)}
           //onKeyPress={handleKeyPress}

        />
        <div>
        <button       className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

                type="button"
                style={{
                  margin: 
                  "10px",
                }
              
                }
                onClick={handleKeyPress}
              >
                {"SEARCH"}
          </button>
        </div>
        
      </div>
       <div className="flex w-full items-center justify-between">
  
         <div className="mt-6 flow-root">
  
           <div className="inline-block min-w-full align-middle">
      
             <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        
             
              <table className="hidden min-w-full text-gray-900 md:table" style={{width: '300px'}}>
                <thead className="rounded-lg text-left text-sm font-normal" style={{ fontFamily: 'Righteous, sans-serif' }}>
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6"> BlockNumber</th>
                    <th scope="col" className="px-3 py-5 font-medium">Event Name</th>
                    <th scope="col" className="px-3 py-5 font-medium">Date & Time</th>
                    <th scope="col" className="px-3 py-5 font-medium">From</th>
                    <th scope="col" className="px-3 py-5 font-medium">To</th>
                    <th scope="col" className="px-3 py-5 font-medium">Credits/ Cid/ Allowance</th>
                    <th scope="col" className="px-3 py-5 font-medium">Block Hash</th>
                    <th scope="col" className="px-3 py-5 font-medium">Transaction Hash</th>

                  </tr>
                </thead>
                <tbody className="bg-white">
                {filteredEvents.map((event, index) => (
                  /* LogIndex, transactionIndex, transactionHash, blockHash, blockNumber, 
                 address, data, topics, returnValues, event, signature, raw
                    returnValues keys: 0 1 2 _ _length_ _from to value */
                  <tr key={index} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">{event['data']['blockNumber'].toString()}</td>            
                    <td className="whitespace-nowrap px-3 py-3"><strong>{event['name']}</strong></td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {event['name']=='CarbonOffsetsClaimed' && event['data']['returnValues']['timestamp'].toString()}
                      {event['name']=='CID' && event['data']['returnValues']['timestamp'].toString()}
                      {event['name']=='Approval' && event.name}
                      {event['name']=='Transfer' && 'see CID'}
                      </td>
                  <td className="whitespace-nowrap px-3 py-3">
                      {event['data']['returnValues']['from']}
                      {event['name']=='CarbonOffsetsClaimed' && event['data']['returnValues'][0].toString()}
                      {event['name']=='Approval' && event['data']['returnValues'][0].toString()}

                      </td>
                    <td className="whitespace-nowrap px-3 py-3"> 
                    <strong>{event['data']['returnValues'][1]}</strong>
                    <strong>{event['name']=='CID' && event['data']['returnValues'][1]}</strong>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {event['name']=='CarbonOffsetsClaimed' && event['data']['returnValues'][1].toString().concat(" AMZ")}
                      {event['name']=='Approval' && event['data']['returnValues'][2].toString().concat(" AMZ")}
                      {event['name']=='CID' && event['data']['returnValues']['cid']}
                      {event['name']=='Transfer' && event['data']['returnValues'][2].toString().concat(" AMZ")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3"><strong>{event['data']['blockHash']}</strong></td>
                    <td className="whitespace-nowrap px-3 py-3">{event['data']['transactionHash']}</td>

                    </tr>
                  ))}
                  
                  </tbody>
                </table>
                
              </div>
            </div>
          </div>
        </div>
      </div>

     
  );


};

export default MyComponent;