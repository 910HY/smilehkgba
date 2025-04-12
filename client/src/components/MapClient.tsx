import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 設置默認圖標
const DefaultIcon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapClientProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

const MapClient: React.FC<MapClientProps> = ({ lat, lng, name, address }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      // 地圖加載後設置視圖
      mapRef.current.setView([lat, lng], 15);
    }
  }, [lat, lng]);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div>
              <h3 className="font-bold">{name}</h3>
              <p className="text-sm">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapClient;