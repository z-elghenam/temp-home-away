"use client"
import { useState } from "react";
import { MapContainer, Marker,  TileLayer,  useMapEvents, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import Title from "../properties/Title";

type Position = [number, number];


const iconUrl =
  'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const markerIcon = icon({
  iconUrl: iconUrl,
  iconSize: [20, 30],
});


function Map() {
   const [mapPosition, setMapPosition] = useState<Position>([40, 0]);

    return (
        <div className='mt-4'>
      <div className='mb-4 '>
        <Title text='Where you will be staying' />
      </div>
      <MapContainer
        scrollWheelZoom={false}
        zoomControl={false}
        className='h-[50vh] rounded-lg relative z-0'
        center={mapPosition}
        zoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ZoomControl position='bottomright' />
        <Marker
          position={mapPosition}
          icon={markerIcon}
        ></Marker>
        <DetectClick setMapPosition={setMapPosition}/>
      </MapContainer>
    </div>
    )
}

interface DetectClickProps {
  setMapPosition: (position: [number, number]) => void;
}


function DetectClick({setMapPosition}: DetectClickProps)  {
   useMapEvents({
    click: (e) => {
      setMapPosition([e.latlng.lat, e.latlng.lng])
    }
  });

  return null;
}


export default Map;
    