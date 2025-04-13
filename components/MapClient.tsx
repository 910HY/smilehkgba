import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapClientProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export default function MapClient({ lat, lng, name, address }: MapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 避免重複創建地圖
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // 建立地圖實例
    const map = L.map(mapRef.current).setView([lat, lng], 16);
    mapInstanceRef.current = map;

    // 添加 OpenStreetMap 底圖
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 自定義診所標記圖示
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: #FF7A00;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    // 添加標記
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // 添加彈出信息窗口
    marker.bindPopup(`
      <strong style="color: #FF7A00;">${name}</strong>
      <p style="margin-top: 5px; color: #333; font-size: 12px;">${address}</p>
    `).openPopup();

    // 清理函數
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name, address]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}