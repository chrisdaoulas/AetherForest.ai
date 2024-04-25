'use client'
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';

import { lusitana } from '@/app/ui/fonts';
import shpwrite from '@mapbox/shp-write';

import { HStack, Text, Button, Input, Box, Spacer } from '@chakra-ui/react';
import { useState,useMemo  } from 'react';
import { useLoadScript, GoogleMap, Marker, Polygon } from '@react-google-maps/api';


export default function Page() {

  
  const libraries = ['drawing'];

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    margin: 'auto',
  };
  
  // const center = {
  //   lat: 2.14767,
  //   lng: -63,
  // };

  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [project, setProject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 2.14767, lng: -63 });
  const [latitude, setLatitude] = useState(mapCenter.lat);
  const [longitude, setLongitude] = useState(mapCenter.lng);
  const [calculation, setCalculation] = useState('');
  const [responseTableData, setResponseTableData] = useState('');


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  const handleMapClick = (event) => {
    setPolygonCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    ]);
  };

  const handleClear = () => {
    setPolygonCoordinates([]);
  };

  const handleDownloadKML = () => {
    if (polygonCoordinates.length === 0) return;

    const kmlContent = generateKML(polygonCoordinates);
    const blob = new Blob([kmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = project+ '.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateKML = (coordinates) => {
    // Generate KML content based on polygon coordinates
    // You can format the KML content according to your requirements
    let kmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    kmlContent += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    kmlContent += '<Document>\n';
    kmlContent += '<name>User Selected Area</name>\n';
    kmlContent += '<Placemark>\n';
    kmlContent += '<Polygon>\n';
    kmlContent += '<outerBoundaryIs>\n';
    kmlContent += '<LinearRing>\n';
    kmlContent += '<coordinates>\n';

    // Ensure the first and last coordinates are the same to close the polygon
    coordinates.push(coordinates[0]);

    coordinates.forEach(coord => {
      kmlContent += `${coord.lng},${coord.lat}\n`;
    });

    kmlContent += '</coordinates>\n';
    kmlContent += '</LinearRing>\n';
    kmlContent += '</outerBoundaryIs>\n';
    kmlContent += '</Polygon>\n';
    kmlContent += '</Placemark>\n';
    kmlContent += '</Document>\n';
    kmlContent += '</kml>';

    return kmlContent;
};

// const handleDownloadShapefile = () => {
//     if (polygonCoordinates.length === 0) return;

//     const shapefileBuffer = generateShapefile(polygonCoordinates);
//     const blob = new Blob([shapefileBuffer], { type: 'application/zip' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = project + '.zip';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// };

// const generateShapefile = (coordinates) => {
//     // Ensure coordinates array is not empty
//     if (coordinates.length === 0) {
//         throw new Error("Coordinates array is empty");
//     }

//     // Generate features for the shapefile
//     const features = [{
//         type: 'Feature',
//         properties: {},
//         geometry: {
//             type: 'Polygon',
//             coordinates: [coordinates.map(coord => [coord.lng, coord.lat])]
//         }
//     }];

//     // Generate Shapefile buffer
//     const buffer = shpwrite.zip(features);

//     // Return the Shapefile buffer
//     return buffer;
// };

// const handleCalculateDeforestationRate = () => {
//     // Perform any necessary data validation...
//     // Assuming you have the KML content stored in a variable named kmlContent
    
//     //const kmlContent = generateKML(polygonCoordinates);
//     const startdate = startDate
//     axios.post('/utils_sat.py', { startdate })
//       .then(response => {
//         // Handle the response from the server...
//         console.log(response.data);
//       })
//       .catch(error => {
//         // Handle any errors...
//         console.error('Error:', error);
//       });
//   };
//   async function handleCalculateDeforestationRate() {
//     const response = await fetch('http://localhost:8000/api/calculate_four_months_before/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ date: startDate })
//     });

//     const data = await response.json();
//     setCalculation(data.calculation);
// }

const handleCalculateDeforestationRate = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/calculate_four_months_before/calculate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: startDate })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    setCalculation(data.calculation);
    setResponseTableData(data); // Set the response data to be displayed in the table

    console.log(data); // Log the response data to the console
    

  } catch (error) {
    console.error('Error:', error);
  }
}

  const handleLatitudeChange = (event) => {
    const { value } = event.target;
    
    // Check if the value is empty
    if (value === "") {
      setLatitude(""); // or set it to null, depending on your use case
      setMapCenter((prevCenter) => ({ ...prevCenter, lat: null })); // or set it to null
      return; // exit early
    }
  
    // Ensure only numbers (including decimals) are considered
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setLatitude(numericValue);
      setMapCenter((prevCenter) => ({ ...prevCenter, lat: numericValue }));
    }
  };


  const handleLongitudeChange = (event) => {
    const { value } = event.target;
    
    // Check if the value is empty
    if (value === "") {
      setLongitude(""); // or set it to null, depending on your use case
      setMapCenter((prevCenter) => ({ ...prevCenter, lng: null })); // Update lng instead of lat
      return; // exit early
    }
  
    // Ensure only numbers (including decimals) are considered
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setLongitude(numericValue);
      setMapCenter((prevCenter) => ({ ...prevCenter, lng: numericValue })); // Update lng instead of lat
    }
  };
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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  const ResponseTable = ({ responseData }) => {
    return (
      <div>
        <h2 className={`${lusitana.className} text-2xl ` } style={{  margin:  "10px", marginLeft: "0px" }} >Response Data</h2>       
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className={`${lusitana.className} text-1xl `} style={{ padding: '10px', backgroundColor: '#f0f0f0',textAlign: 'left',  }}>Field</th>
              <th className={`${lusitana.className} text-1xl `} style={{ padding: '10px', backgroundColor: '#f0f0f0', textAlign: 'left',  }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(responseData).map(([key, value]) => (
              <tr key={key}>
                <td className={`${lusitana.className} text-1xl `}  style={{ padding: '10px' }}>{key}</td>
                <td className={`${lusitana.className} text-1xl `}  style={{ padding: '10px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-3xl mb-4`}>User Selected Area of Interest</h1>


    
    <h1 className={`${lusitana.className} text-1xl mt-5 mb-4` } style={{  margin:  "10px", marginLeft: "0px" }} >To utilize our deforestation monitoring tool, begin by defining your area of interest by clicking points on the map to create a polygon boundary, representing the region for monitoring. Next, select the start and end dates to specify the monitoring period. Clicking the "Define AOI" button generates a KML file containing the defined area and time range. Import this file into GIS software to analyze deforestation rates. Regularly monitor changes and take action to mitigate deforestation. For further assistance, contact our support team.</h1>

    <Spacer height="10px" />
    <GoogleMap
        mapContainerStyle={mapContainerStyle}
        mapTypeId={google.maps.MapTypeId.SATELLITE}
        options={mapOptions}           
        zoom={8}
        center={mapCenter}
        onClick={handleMapClick}
      >
        {polygonCoordinates.length > 0 && (
          <Polygon
            paths={polygonCoordinates}
            options={{
              fillColor: '#00FF00',
              fillOpacity: 0.35,
              strokeColor: '#00FF00',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
        <Marker position={mapCenter} />
      </GoogleMap>

        <Box h='30px'/>
        <Text className={`${lusitana.className} text-1xl mb-2` } style={{  margin:  "0px", marginLeft: "0px" }}>Please select Latitude, Longitude and time range</Text>                

        <HStack w='md'>
        <Input
          type='number'
          size='md'
          placeholder='Latitude'
          value={latitude}
          onChange={handleLatitudeChange}
          style={{ width: '90px' }}
        />
        <Input
          type='number'
          size='md'
          placeholder='Longitude'
          value={longitude}
          onChange={handleLongitudeChange}
          style={{ width: '90px' }}
        />
        <DatePicker
        selected={startDate}
        onChange={(date) => {
            // Check if the selected date is after the current end date
            if (date.getFullYear() >= 2014) {
            // If the selected date is after 2014, update the start date
            setStartDate(date);
            }
        }}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Time Start"
        dateFormat="yyyy/MM/dd"
        />
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              // Check if the selected date is after the start date
              if (date >= startDate) {
                // If the selected date is after or equal to the start date, update the end date
                setEndDate(date);
              } else {
                // Otherwise, keep the end date the same as the start date
                setEndDate(startDate);
              }
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate} // Ensures that the user can't select a date before the start date
            placeholderText="Time End"
            dateFormat="yyyy/MM/dd"
          />

                <Input
                type='text' // Use lowercase 'text' for text input
                size='md'
                placeholder='Project Identifier'
                value={project} // Assuming 'project' is the variable to save the input text
                onChange={(event) => setProject(event.target.value)} // Update the 'project' variable as the user types
                />                      
              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px", flex: 1}}  bg='green.200' onClick={handleDownloadKML} >Define AOI</Button>

              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px", flex: 1}}  bg='green.200' onClick={handleCalculateDeforestationRate} >Calculate Deforestation Rate</Button>

              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px", flex: 1}}  bg='green.200' onClick={handleClear} >Clear</Button>
            
            </HStack>
            <Spacer height="30px" />
            {responseTableData && <ResponseTable responseData={responseTableData} />}
    </div>
  );
};
