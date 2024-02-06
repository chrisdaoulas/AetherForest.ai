'use client'
import { useEffect, useState } from 'react';
import sqlite3 from 'sqlite3';

const Home = () => {


  // Define a state variable "items" and a function "setItems" to update the state
  const [items, setItems] = useState([]);

  // Use the useEffect hook to fetch data from the API endpoint when the component mounts
  useEffect(() => {
    try {
    fetch("http://localhost:3000/api/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the request headers to indicate JSON format
      },
    })
      .then((res) => res.json()) // Parse the response data as JSON
      .then((data) => setItems(data)); // Update the state with the fetched data

} catch( error){
    throw new Error('Failed to fetch data');
    console.error('Error fetching data:', error);
        
}
  }, []);

  return (
    <div>
      <h1>Data from defrate.db</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{/* Render your data here */}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;



/* 'use client'

import sqlite3 from 'sqlite3';
import { useEffect, useState } from 'react';



export default function Page(){

const [defRates, setDefRates] = useState([]);

useEffect(() => {

const fetchData = async () => {
    try {
    const response = await fetch('/lib/carbon');
    const data = await response.json();
    setDefRates(data);
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

fetchData();
}, []);

return (
<div>
    <h1>Deforestation Rates</h1>
    <ul>
    {defRates.map((defRate) => (
        <li key={defRate.id}>{defRate.Rate_of_Deforestation}</li>
    ))}
    </ul>
</div>
);

};




 */