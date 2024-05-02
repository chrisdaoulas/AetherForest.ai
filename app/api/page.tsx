 'use client'

 
import { useEffect, useState } from 'react';
import { lusitana } from '../ui/fonts';

const Home = () => {
  const [items, setItems] = useState([]);//useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/');
        if (response.ok) {
          const data = await response.json();//await response.json();
          setItems(data);
         
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', (error as Error).message);
      }
    };

    fetchData();
  }, []);
  
  return (
    <div className="w-full">
             <div className="flex w-full items-center justify-between">
  
  <div className="mt-6 flow-root">

    <div className="inline-block min-w-full align-middle">

      <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
      <h1 className={`${lusitana.className} text-3xl`}>Automated Carbon Credit Flow</h1>
      <table className="hidden min-w-full text-gray-900 md:table" style={{width: '300px'}} >
        <thead className="rounded-lg text-left text-sm font-normal" style={{ fontFamily: 'Righteous, sans-serif' }}>
          <tr>
            <th scope="col" className="px-4 py-5 font-medium  sm:pl-6"> <strong>Time</strong></th> 
            <th scope="col" className="px-4 py-5 font-medium  sm:pl-6"> <strong>Rate of Deforestation</strong></th> 
            <th scope="col" className="px-4 py-5 font-medium  sm:pl-6"> <strong>CID</strong></th> 
          
            
          </tr>
        </thead>
        <tbody>
          {items.map((row: { Time: string, Rate_of_Deforestation: number, File_Hash: string }, index) => (
            <tr key={index}>
              <td>{row.Time}</td>
              <td>{row.Rate_of_Deforestation}</td>
              <td>{row.File_Hash}</td>
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

export default Home; 
/* 
import React, { useEffect, useState } from 'react';
import initSqlJs from 'sql.js';

const Home = () => {
  const [db, setDb] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const initDatabase = async () => {
      const response = await fetch('./defrate.db'); // Replace with the actual path
      const buffer = await response.arrayBuffer();
      const SQL = await initSqlJs({ locateFile: () => 'C:/Users/cdaou/OneDrive/Documents/MSBDGA/Github/AmazoniaCoin/node_modules/sql.js/dist/sql-wasm.wasm' }); // Replace with the actual path
      const database = new SQL.Database(new Uint8Array(buffer));
      setDb(database);
    };

    initDatabase();
  }, []);

  useEffect(() => {
    if (db) {
      const query = 'SELECT * FROM Deforestation_Rate';
      const result = db.exec(query);
      const rows = result[0]?.values || [];
      setItems(rows);
    }
  }, [db]);

  return (
    <div>
      <h1>Deforestation Data</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>            
            <th>Rate_of_Deforestation</th> 
            <th>Time</th>
            <th>File_Hash</th>          
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr key={index}>
              {row.map((column, columnIndex) => (
                <td key={columnIndex}>{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home; */



/* const sqlite3 = require('sqlite3');

const Home = () => {

  const dbPath = './defrate.db';

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

  const query = 'SELECT * FROM Deforestation_Rate';

  function item(){
        const item = db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error executing the query:', err.message);
        } else {    
          console.log(JSON.stringify(rows));
          
        }
        }); 

        return JSON.stringify(item);
  } 

  return (
    <div>
      <h1>Deforestation Data</h1>
      <ul>
        {item()}
      </ul>
    </div>
  );
}


export default Home;
 */
/* 'use client'
 
const sqlite3 = require('sqlite3');


//const Home = () => {

  const dbPath = './defrate.db';

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error opening the database:', err.message);
    } else {
      console.log('Connected to the SQLite database');
    }
  });

  const query = 'SELECT * FROM Deforestation_Rate';
   const item1 = db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error executing the query:', err.message);
    } else {
      // Log the query results
      
      console.log(rows);
      db.close()
      return rows
  
      // Close the database connection
      
      
    }
  }); 

  console.log(item1); */

    




  
//export default Home;
 
  //return items;
//}



/*   db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
  }); */


    /* 
import sqlite from 'better-sqlite3';


export default (req, res) => {
  // Open the SQLite database
  const db = sqlite('./defrate.db', { readonly: true });

  try {
    // Query the database
    const data = db.prepare('SELECT * FROM Deforestation_Rate').all();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the database connection
    db.close();
  }
};
/* 
import sqlite3 from 'sqlite3';
import { open} from 'sqlite';

let db = null;
 
// Define the GET request handler function
export async function GET(req, res) {
  // Check if the database instance has been initialized
   if (!db) {
    // If the database instance is not initialized, open the database connection
    db = open({
      filename: "./defrate.db", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  } 

  const db = new sqlite3.Database('@/app/api/defrate.db');


  try {
  // Perform a database query to retrieve all items from the "items" table
  const items =  db.all("SELECT * FROM Deforestation_Rate");

  // Return the items as a JSON response with status 200
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
} catch (error) {
  console.error('Error executing SQL query:', error.message);
  //res.status(500).json({ error: 'Internal Server Error' });
 } 
}
 */ 