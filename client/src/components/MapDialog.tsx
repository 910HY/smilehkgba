import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Clinic } from '../types/clinic';
import MapView from './MapView';
import { geocodeAddress, getDefaultHongKongLocation, getDefaultGBALocation } from '../lib/geocoder';
import { Loader2 } from 'lucide-react';

interface MapDialogProps {
  clinic: Clinic;
  isOpen: boolean;
  onClose: () => void;
}

const MapDialog: React.FC<MapDialogProps> = ({ clinic, isOpen, onClose }) => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && clinic) {
      setIsLoading(true);
      setError(null);
      
      // 嘗試地理編碼診所地址
      const fetchLocation = async () => {
        try {
          // 對診所地址進行地理編碼
          const result = await geocodeAddress(
            `${clinic.name}, ${clinic.address}`,
            clinic.country
          );
          
          if (result.success) {
            setLocation({
              lat: result.lat,
              lng: result.lng
            });
            setIsLoading(false);
          } else {
            console.warn(`地理編碼失敗: ${clinic.name}, ${clinic.address}`, result.error);
            
            // 使用默認位置（根據區域）
            if (clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門') {
              setLocation(getDefaultGBALocation(clinic.region || clinic.city));
            } else {
              setLocation(getDefaultHongKongLocation(clinic.region));
            }
            setError('無法精確定位此診所，顯示該區域的大致位置');
            setIsLoading(false);
          }
        } catch (err) {
          console.error('獲取位置時出錯:', err);
          setError('載入地圖時發生錯誤');
          setIsLoading(false);
        }
      };
      
      fetchLocation();
    }
  }, [isOpen, clinic]);

  if (!isOpen || !clinic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-[#2B1B0F] border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-primary">{clinic.name}</DialogTitle>
          <DialogDescription className="text-primary/80">
            {clinic.address}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          {isLoading ? (
            <div className="w-full h-[300px] flex items-center justify-center bg-primary/5 rounded-lg">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2 text-primary">正在載入地圖...</span>
            </div>
          ) : location ? (
            <>
              <MapView 
                lat={location.lat} 
                lng={location.lng} 
                name={clinic.name}
                address={clinic.address}
              />
              {error && (
                <div className="text-yellow-500 text-sm p-2 bg-yellow-500/10 rounded">
                  <p>{error}</p>
                </div>
              )}
              <div className="text-xs text-primary/60 text-center">
                {clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門' 
                  ? '地圖數據來源: OpenStreetMap © OpenStreetMap 貢獻者'
                  : '地圖數據來源: OpenStreetMap © OpenStreetMap 貢獻者'}
              </div>
            </>
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-primary/5 rounded-lg">
              <p className="text-primary">無法載入地圖</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;