// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}

initMap();

/* import { useEffect, useRef, useMemo } from "react";
import { Loader } from "@googlemaps/js-api-loader";


function Map({ address }) {

    const mapRef = useRef(null);
    const geocoder = useMemo(() => new google.maps.Geocoder(), []);

    useEffect(() => {

        const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        });

        loader.importLibrary().then(() => {
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === "OK") {
                const map = new google.maps.Map(mapRef.current, {
                    center: results[0].geometry.location,
                    zoom: 8,
                });

        const marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                });
                } else {
                console.error(`Geocode was not successful for the following reason: ${status}`);
                }
            });
            });
        }, [address, geocoder]);

    return <div style={{ height: "400px" }} ref={mapRef} />;
}
export default Map; */