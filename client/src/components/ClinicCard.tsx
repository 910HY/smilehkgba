import React, { useState } from 'react';
import { Clinic } from '../types/clinic';
import MapDialog from './MapDialog';
import { generateAmapSearchUrl } from '../lib/generateAmapLink';

interface ClinicCardProps {
  clinic: Clinic;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  // 生成高德地圖鏈接 (中國地區)
  const amapUrl = clinic.isGreaterBayArea || clinic.country === '中國' 
    ? generateAmapSearchUrl(clinic.address)
    : null;
  
  // 生成Google Maps鏈接 (香港地區)
  const googleMapsUrl = !clinic.isGreaterBayArea && clinic.country !== '中國'
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`
    : null;
  
  // 判斷是否顯示地圖對話框
  const canShowMapDialog = clinic.location && clinic.location.lat && clinic.location.lng;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-[#ffaa40] line-clamp-2">{clinic.name}</h3>
          {clinic.isChain && (
            <span className="bg-orange-900/40 text-orange-300 text-xs px-2 py-1 rounded-full">
              連鎖
            </span>
          )}
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-2">
          {clinic.address}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">地區</span>
            <span className="text-[#ffbb66]">{clinic.region}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">電話</span>
            <a 
              href={`tel:${clinic.phone}`} 
              className="text-[#ffbb66] hover:underline"
            >
              {clinic.phone}
            </a>
          </div>
        </div>
        
        <div className="flex flex-col mb-5">
          <span className="text-xs text-gray-400 mb-1">營業時間</span>
          <span className="text-white text-sm">{clinic.hours}</span>
        </div>
        
        <div className="flex flex-col space-y-2">
          {/* 價格信息 */}
          {clinic.prices && Object.keys(clinic.prices).length > 0 && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-4">
              {clinic.prices.洗牙 && (
                <div className="flex justify-between items-center bg-gray-700/50 rounded-md px-2 py-1">
                  <span className="text-xs text-gray-300">洗牙</span>
                  <span className="text-xs font-medium text-orange-300">{clinic.prices.洗牙}</span>
                </div>
              )}
              {clinic.prices.補牙 && (
                <div className="flex justify-between items-center bg-gray-700/50 rounded-md px-2 py-1">
                  <span className="text-xs text-gray-300">補牙</span>
                  <span className="text-xs font-medium text-orange-300">{clinic.prices.補牙}</span>
                </div>
              )}
              {clinic.prices.拔牙 && (
                <div className="flex justify-between items-center bg-gray-700/50 rounded-md px-2 py-1">
                  <span className="text-xs text-gray-300">拔牙</span>
                  <span className="text-xs font-medium text-orange-300">{clinic.prices.拔牙}</span>
                </div>
              )}
              {clinic.prices.植牙 && (
                <div className="flex justify-between items-center bg-gray-700/50 rounded-md px-2 py-1">
                  <span className="text-xs text-gray-300">植牙</span>
                  <span className="text-xs font-medium text-orange-300">{clinic.prices.植牙}</span>
                </div>
              )}
              {clinic.prices.矯正 && (
                <div className="flex justify-between items-center bg-gray-700/50 rounded-md px-2 py-1">
                  <span className="text-xs text-gray-300">矯正</span>
                  <span className="text-xs font-medium text-orange-300">{clinic.prices.矯正}</span>
                </div>
              )}
            </div>
          )}
          
          {/* 操作按鈕 */}
          <div className="flex space-x-2">
            {/* 地圖按鈕 */}
            {canShowMapDialog ? (
              <button
                onClick={() => setIsMapDialogOpen(true)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-center"
              >
                <span>🗺️</span>
                <span className="ml-1">查看地圖</span>
              </button>
            ) : (
              googleMapsUrl || amapUrl ? (
                <a
                  href={googleMapsUrl || amapUrl || '#'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-center"
                >
                  <span>🗺️</span>
                  <span className="ml-1">前往地圖</span>
                </a>
              ) : null
            )}
            
            {/* 電話按鈕 */}
            <a
              href={`tel:${clinic.phone}`}
              className="flex-1 bg-[#ff7a00] hover:bg-[#ff9530] text-white py-2 px-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-center"
            >
              <span>📞</span>
              <span className="ml-1">致電查詢</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* 地圖對話框 */}
      {canShowMapDialog && (
        <MapDialog
          clinic={clinic}
          isOpen={isMapDialogOpen}
          onClose={() => setIsMapDialogOpen(false)}
        />
      )}
    </div>
  );
}