'use client'
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Image from 'next/image';
import kayapo from '@/public/kayapo.jpg';
import yanomami from '@/public/yanomami.jpg';
/*import yanomami from '@/public/yanomami.jpg';*/
import { lusitana } from '@/app/ui/fonts';
import brazil from '@/public/brazil.svg';
import Link from 'next/link';
import { VStack, HStack, Heading, Text, Button, Input, Box, Spacer, Spinner, chakra } from '@chakra-ui/react';
import { useMemo, useState  } from 'react';
import { useLoadScript, GoogleMap, Marker, Polygon } from '@react-google-maps/api';


export default function Page() {

  
  const libraries = ['drawing'];

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
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
  // const handleLatitudeChange = (event) => {
  //   const value = parseFloat(event.target.value);
  //   setLatitude(value);
  //   setMapCenter((prevCenter) => ({ ...prevCenter, lat: value }));
  // };
  // const handleLatitudeChange = (event) => {
  //   const { value } = event.target;
  //   const floatValue = parseFloat(value);
  //   if (!isNaN(floatValue)) {
  //     setLatitude(floatValue);
  //     setMapCenter((prevCenter) => ({ ...prevCenter, lat: floatValue }));
  //   }
  // };

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

  

  // const handleLongitudeChange = (event) => {
  //   const value = parseFloat(event.target.value);
  //   setLongitude(value);
  //   setMapCenter((prevCenter) => ({ ...prevCenter, lng: value }));
  // };

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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-3xl`}>AetherForest.ai PES Projects</h1>
      <div className="flex w-full mt-5 mb-2 justify-between">
        <div className="w-1/3 mt-6">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="text-justify" style={{ textAlign: 'left', maxWidth: '350px', margin: 'auto' }}>
              <Image src={kayapo} alt="Kayapo Project" style={{ width: '95%', borderRadius: '8px 8px 0 0' }} />
              <div className="text-justify" style={{ padding: '32px', background: '#fff', borderRadius: '0 0 8px 8px' }}>
                <h2 className={`${lusitana.className} text-2xl items-full`} ><strong>Kayapo Project</strong></h2>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  <span className={`${lusitana.className} text-1xl mt-5 mb-2`} role="img" aria-label="Brazil Flag">
                    <Image className='mt-5 mb-2' src={brazil} alt="Kayapo Project" style={{ width: '11%', borderRadius: '0px 0px 0 0' }} />
                  </span>{' '}
                  Brazil
                </p>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  The Kayapo indigenous people safeguard over 9 million hectares (22 million acres) of the Amazon Rainforest, an expanse equivalent to Portugal. With a commitment to their traditional way of life, they resist large-scale deforestation, protecting their territory—a biodiversity haven. The ~8,000 Kayapó preserve an area akin to Portugal or South Korea, primarily composed of primary forest with patches of savannah on Brazilian shield bedrock. This territory fosters diverse species like white-lipped peccary, tapir, giant armadillo, giant otter, giant anteater, jaguar, hyacinth macaw, harpy eagle, white-whiskered spider monkey, and saki monkey, facing threats elsewhere.
                </p>
                <Link href="./projects/kayapo">
                  <button className={`${lusitana.className} mt-5 mb-2 flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`} type="button">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-0 mb-2 justify-between">
        <div className="w-1/3 mt-6">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="text-justify" style={{ textAlign: 'left', maxWidth: '350px', margin: 'auto' }}>
              <Image src={yanomami} alt="Yanomami Project" style={{ width: '110%', borderRadius: '8px 8px 0 0' }} />
              <div className="text-justify" style={{ padding: '30px', background: '#fff', borderRadius: '0 0 8px 8px' }}>
                <h2 className={`${lusitana.className} text-2xl items-full`} ><strong>Yanomami Project</strong></h2>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                  <span className={`${lusitana.className} text-1xl mt-5 mb-2`} role="img" aria-label="Brazil Flag">
                    <Image className='mt-5 mb-2' src={brazil} alt="Yanomami Project" style={{ width: '11%', borderRadius: '0px 0px 0 0' }} />
                  </span>{' '}
                  Brazil
                </p>
                <p className={`${lusitana.className} text-1xl mt-5 mb-2`}>
                The Yanomami tribe, inhabits an area of around 9.6 million hectares of pristine rainforest in the Amazon basin. Their efforts in protecting this vast territory are significant, given that the Amazon rainforest serves as the planet's largest carbon sink, sequestering an estimated 2.2 billion metric tons of CO2 annually. The Yanomami's resistance against illegal activities such as logging and mining has helped to preserve biodiversity, with their land containing an estimated 12% of the world's plant and animal species. Moreover, their advocacy has led to the establishment of protected areas and legal recognition of indigenous land rights, contributing to the conservation of vital ecosystems.
                </p>
                <Link href="./projects/yanomami">
                  <button className={`${lusitana.className} mt-5 mb-2 flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`} type="button">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Spacer h="40px" />
    <h1 className={`${lusitana.className} text-2xl mt-10` } style={{  margin:  "10px"}} >User Selected Area of Interest</h1>

    <GoogleMap
        mapContainerStyle={mapContainerStyle}
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
        <Text className={`${lusitana.className} text-1xl`}>Please select Lattitude, Longitude and time range</Text>                

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
