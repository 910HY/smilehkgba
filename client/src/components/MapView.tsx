import React from 'react';
import dynamic from 'next/dynamic';

// 定義 Props 接口
interface MapViewProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

// 創建一個無 SSR 的地圖組件
const MapWithNoSSR = dynamic(
  () => import('./MapClient'), // 我們將建立這個組件
  { 
    ssr: false, // 禁用伺服器端渲染
    loading: () => (
      <div className="w-full h-[300px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-800">
        <p className="text-amber-500">載入地圖中...</p>
      </div>
    )
  }
);

// 主要的 MapView 組件現在只是一個包裝器
const MapView: React.FC<MapViewProps> = ({ lat, lng, name, address }) => {
  return <MapWithNoSSR lat={lat} lng={lng} name={name} address={address} />;
};

export default MapView;