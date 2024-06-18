'use client'
import React, { useEffect }  from 'react';
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
  


  const [polygonCoordinates, setPolygonCoordinates] = useState([]);

  const [kmlLayer, setkmlLayer] = useState<google.maps.KmlLayer | null>(null);
  const [kmlBounds, setkmlBounds] = useState<google.maps.LatLngBounds | null>(null);
  
  const [project, setProject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 2.14767, lng: -63 });
  const [latitude, setLatitude] = useState(mapCenter.lat);
  const [longitude, setLongitude] = useState(mapCenter.lng);
  const [calculation, setCalculation] = useState('');

  const [responseTableData, setResponseTableData] = useState(() => {
    // Retrieve the response data from localStorage if available
  const savedData = localStorage.getItem('responseTableData');
    return savedData ? JSON.parse(savedData) : '';
  });

  const [isLoading, setIsLoading] = useState('');
  const [mapInstance, setMapInstance] = useState(''); // State variable to store the map instance
  const [showNotification, setshowNotification] = React.useState<boolean>(false);
  const [inputAlerts, setInputAlerts] = React.useState<any>(null);


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  useEffect(() => {
    // Retrieve the response data from localStorage if available
    const savedData = localStorage.getItem('responseTableData');
    if (savedData) {
      setResponseTableData(JSON.parse(savedData));
    }
  }, []);


  useEffect(() => {
    if (responseTableData) {
      localStorage.setItem('responseTableData', JSON.stringify(responseTableData));
    }
  }, [responseTableData]);


  useEffect(() => {
    if (project) {
      if (project === 'Kayapo') {
        handleClear()
        loadKmlLayerKayapo(mapInstance);
      } else if (project === 'Yanomami') {
        handleClear()
        loadKmlLayerYanomami(mapInstance);
      }
    }
  }, [project]);
  

  

  function Notification() {
    return (
      <div className="mb-4 rounded-lg bg-orange-400 bg-success-100 px-6 py-5 text-white text-success-700" role="alert">
      <strong>Warning</strong> {inputAlerts}
      <button onClick={() => setshowNotification(false)} className="float-right">
        Close
      </button>
    </div>
    );
  }

/*   const handleMapClick = (event) => {
    setPolygonCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    ]);
  }; */


  const handleMapClick = (event) => {
    const clickCoordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
  
    // Check if the clicked coordinates are within the bounds of the KML layer
    if (kmlBounds && kmlBounds.contains(new google.maps.LatLng(clickCoordinates.lat, clickCoordinates.lng))) {
      setPolygonCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        clickCoordinates,
      ]);
    } else {
      // Notify the user that the point is outside the KML layer bounds
      alert('You can only create polygons within the bounds of the KML layer.');
    }
  };
  
  const loadKmlLayerKayapo = (mapInstance) => {
    const kmlUrl = "https://drive.google.com/uc?export=download&id=1N-ixnCzi4r0RWSro3OXz20ZUzGLWL_DS";
  
    const kmlLayer = new window.google.maps.KmlLayer({
      url: kmlUrl,
      map: mapInstance,
      suppressInfoWindows: false,
      preserveViewport: true,
      zIndex: 0, // Lower zIndex to be below polygons
    });
  
    setkmlLayer(kmlLayer);
  
    kmlLayer.set('options', {
      preserveViewport: true,
      suppressInfoWindows: true,
      clickable: true,
      zIndex: 0,
      strokeColor: '#00FF00', // Green color
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00', // Green color
      fillOpacity: 0.35,
    });
  
    // Extract the boundaries of the KML layer
    google.maps.event.addListenerOnce(kmlLayer, 'defaultviewport_changed', () => {
      const bounds = kmlLayer.getDefaultViewport();
      setkmlBounds(bounds);
    });
  };
  


  const loadKmlLayerYanomami = (mapInstance) => {
    const kmlUrl = "https://gateway.pinata.cloud/ipfs/QmXQDaAk6RkmDWuefL6H4EGJp9F9hpoRq6BkfqWaR75XPm";
    const kmlLayer = new window.google.maps.KmlLayer({
      url: kmlUrl,
      map:mapInstance,
      suppressInfoWindows: false,  
      preserveViewport: true,
      zIndex: 0, // Lower zIndex to be below polygons

    });
    setkmlLayer(kmlLayer);

    kmlLayer.set('options', {
        preserveViewport: true,
        suppressInfoWindows: true,
        clickable: false,
        zIndex: 0,
        strokeColor: '#00FF00', // Green color
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00FF00', // Green color
        fillOpacity: 0.35,
      });
    
    
      // Extract the boundaries of the KML layer
      google.maps.event.addListenerOnce(kmlLayer, 'defaultviewport_changed', () => {
        const bounds = kmlLayer.getDefaultViewport();
        setkmlBounds(bounds);
      });
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


const handleCalculateDeforestationRate = async () => {

  if (!project) {
    console.error('No project selected.');
    setshowNotification(true);

    setTimeout(() => {
      setshowNotification(false);
    }, 5000);
    setInputAlerts('Please Select a Project');
    return; // Exit the function early if no project is selected
  }
  
  try {

    setIsLoading(true); // Set loading state to true
    console.log("Please wait while Google Earth Engine analyses your AOI's deforestation rate... Average waiting time is 15-20 minutes");

    const formData = new FormData();

    // Generate KML content from selected map polygons
    if (polygonCoordinates.length > 0) {
      const kmlContent = generateKML(polygonCoordinates);
      const kmlBlob = new Blob([kmlContent], { type: 'text/xml' });
      formData.append('project', kmlBlob, `${project}.kml`);
            
      const response = await fetch('http://localhost:8000/api/calculate_deforestation_rate_aoi/calculate/', {
        method: 'POST',
        body: formData
      }); 
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setCalculation(data.result);//.calculation);
      setResponseTableData(data); // Set the response data to be displayed in the table
  
      console.log(data); // Log the response data to the console

    } else {
      formData.append('project', project);
      const response = await fetch('http://localhost:8000/api/calculate_deforestation_rate_project/calculate/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setCalculation(data.result);//.calculation);
      setResponseTableData(data); // Set the response data to be displayed in the table
  
      console.log(data); // Log the response data to the console
    }

/*     const response = await fetch('http://localhost:8000/api/calculate_deforestation_rate/calculate/', {
      method: 'POST',
//      headers: {
  //      'Content-Type': 'application/json'
    //  },
      //body: JSON.stringify({ date: startDate })
      body: formData
    }); */

   
    

  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false); // Set loading state to false after fetch completes
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

  

  const handleProjectChange = (event) => {
    const selectedProject = event.target.value;
    setProject(selectedProject);

    // Set the latitude and longitude based on the selected project
    if (selectedProject === 'Yanomami') {
      setLatitude(2.14767);
      setLongitude(-63);
      setMapCenter({ lat: 2.14767, lng: -63 });
    } else if (selectedProject === 'Kayapo') {
      setLatitude(-7.731462);
      setLongitude(-51.987736);
      setMapCenter({ lat: -7.731462, lng: -51.987736 });
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

    const convertToCSV = () => {
      const header = Object.keys(responseData);
      const rows = [header.join(',')];
  
      const values = Object.values(responseData);
      rows.push(values.join(','));
  
      const csvContent = rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary anchor element and click it to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'response_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <div>


        <h2 className={`${lusitana.className} text-2xl ` } style={{  margin:  "10px", marginLeft: "0px" }} >AOI Satellite Analysis Results</h2>       

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className={`${lusitana.className} text-1xl `} style={{ padding: '10px', backgroundColor: '#38A169',textAlign: 'left', color: "white"  }}>Field</th>
              <th className={`${lusitana.className} text-1xl `} style={{ padding: '10px', backgroundColor: '#38A169', textAlign: 'left',  color: "white"}}>Value</th>
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


      <button className={`bg-green-600 hover:bg-blue-700 text-white font-${lusitana.className} font-bold py-2 px-4 rounded mt-4`} onClick={convertToCSV}>
        Download CSV
      </button>

      </div>
    );
  };



  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-3xl mb-4`}>User Selected Area of Interest</h1>


    
    <h1 className={`${lusitana.className} text-1xl mt-5 mb-4` } style={{  margin:  `10px`, marginLeft: `0px` }} >To utilize our deforestation monitoring tool, begin by defining your area of interest by clicking points on the map to create a polygon boundary, representing the region for monitoring. Next, select the start and end dates to specify the monitoring period. Clicking the `Define AOI` button generates a KML file containing the defined area and time range. Import this file into GIS software to analyze deforestation rates. Regularly monitor changes and take action to mitigate deforestation. For further assistance, contact our support team.</h1>

    <Spacer height="10px" />

    <GoogleMap
        mapContainerStyle={mapContainerStyle}
        mapTypeId={google.maps.MapTypeId.SATELLITE}
        options={mapOptions}           
        zoom={8}
        center={mapCenter}
        onClick={handleMapClick}
        onLoad={map => setMapInstance(map)} // Get the map instance

      >
        {polygonCoordinates.length > 0 && 
(
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
        <Text className={`${lusitana.className} text-1xl mb-2` } style={{  margin:  "0px", marginLeft: "0px" }}><strong>Please select Latitude, Longitude and time range</strong></Text>                

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

                <select
                    size='md'
                    value={project} // Assuming 'project' is the variable to save the selected value
                    //onChange={(event) => setProject(event.target.value)} // Update the 'project' variable as the user selects an option
                    onChange={handleProjectChange}
                    >
                    <option value="" disabled>Select Project</option>
                    <option value="Kayapo">Kayapo</option>
                    <option value="Yanomami">Yanomami</option>
                  </select>                      
              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px", flex: 1}}  bg='green.200' onClick={handleDownloadKML} >Define AOI</Button>

              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px", flex: 1}}  bg='green.200' onClick={handleCalculateDeforestationRate} >Calculate Deforestation Rate</Button>

              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px", flex: 1}}  bg='green.200' onClick={handleClear} >Clear</Button>
            
            </HStack>
            <Spacer height="30px" />
            {showNotification && <Notification />}
            {isLoading && (
        <p style={{ color: 'green' }}>Please wait while Google Earth Engine analyses your AOI's deforestation rate... Average waiting time is 15-20 minutes</p>
      )}
            {!isLoading && responseTableData && (
        <ResponseTable responseData={responseTableData} />
      )}

{!isLoading && !responseTableData && (
        <p style={{ color: 'green' }}>No data available</p>
      )}

    </div>
  );
};
