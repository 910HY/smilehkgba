import { useState, useEffect } from 'react';
import { Clinic } from '../types/clinic';
import dynamic from 'next/dynamic';

// 動態導入 MapView 組件，避免 SSR 時 window is not defined 的錯誤
const MapClient = dynamic(() => import('./MapClient'), { ssr: false });

interface MapDialogProps {
  clinic: Clinic;
  isOpen: boolean;
  onClose: () => void;
}

export default function MapDialog({ clinic, isOpen, onClose }: MapDialogProps) {
  const [isClient, setIsClient] = useState(false);

  // 確保 window 對象存在，才渲染地圖
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen) return null;

  // 檢查是否有有效的位置資訊
  if (!clinic.location || !clinic.location.lat || !clinic.location.lng) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#ffaa40]">{clinic.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-300">抱歉，目前沒有此診所的地圖資訊。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#ffaa40]">{clinic.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300">{clinic.address}</p>
        </div>
        
        <div className="h-[400px] bg-gray-700 rounded-lg overflow-hidden">
          {isClient && clinic.location && clinic.location.lat && clinic.location.lng && (
            <MapClient
              lat={clinic.location.lat}
              lng={clinic.location.lng}
              name={clinic.name}
              address={clinic.address}
            />
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-sm text-gray-400">電話: <a href={`tel:${clinic.phone}`} className="text-[#ffbb66] hover:underline">{clinic.phone}</a></p>
            <p className="text-sm text-gray-400">營業時間: <span className="text-white">{clinic.hours}</span></p>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}