'use client'
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

import { lusitana } from '@/app/ui/fonts';

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 2.14767, lng: -63 });
  const [latitude, setLatitude] = useState(mapCenter.lat);
  const [longitude, setLongitude] = useState(mapCenter.lng);

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
    a.download = 'user_selected_area.kml';
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
        />
        <Input
          type='number'
          size='md'
          placeholder='Longitude'
          value={longitude}
          onChange={handleLongitudeChange}
        />
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              // Check if the selected date is after the current end date
              if (date > endDate) {
                // If the selected date is after the current end date, update the end date
                setEndDate(date);
              }
              // Update the start date regardless
              setStartDate(date);
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Time Start"
            dateFormat="dd/MM/yyyy"
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
            dateFormat="dd/MM/yyyy"
          />                      
              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px"}}  bg='green.200' onClick={handleDownloadKML} >Define AOI</Button>

              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px"}}  bg='green.200' onClick={handleClear} >Calculate Deforestation Rate</Button>

              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "0px"}}  bg='green.200' onClick={handleClear} >Clear</Button>
            
            </HStack>
    </div>
  );
};
