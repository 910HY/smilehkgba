import { useState } from 'react';
import { Clinic } from '../types/clinic';
import { 
  MapPin, Phone, Clock, DollarSign, Map,
  Stethoscope, Building, HeartPulse, Star
} from 'lucide-react';
import MapDialog from './MapDialog';
import ExpandableText from './ExpandableText';
import { generateAmapSearchUrl } from '../lib/generateAmapLink';

function generateAmapMarkerUrl(clinic: Clinic): string | null {
  if (!clinic.location || !clinic.location.lng || !clinic.location.lat) return null;

  const { lng, lat } = clinic.location;
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(clinic.name)}&callnative=0`;
}

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard = ({ clinic }: ClinicCardProps) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  // 調試診所數據
  console.log('診所數據:', clinic.name, '評分:', clinic.rating, '連鎖標籤:', clinic.is_chain, clinic.isChain);

  // 格式化電話號碼以便顯示
  const formatPhone = (phone: string | number) => {
    if (!phone) return '無提供';
    
    if (typeof phone === 'number') {
      return phone.toString().replace(/(\d{4})(\d{4})/, '$1 $2');
    }
    
    const phoneStr = phone.toString().trim();
    if (phoneStr.length === 8) {
      return phoneStr.replace(/(\d{4})(\d{4})/, '$1 $2');
    }
    return phoneStr;
  };

  // 格式化營業時間以便顯示
  const formatHours = (hours: string) => {
    if (!hours || hours === '-') return '詳情請致電查詢';
    return hours;
  };
  
  // 格式化價格信息
  const formatPrices = (prices?: Record<string, string>) => {
    if (!prices) return null;
    
    return Object.entries(prices)
      .map(([service, price]) => `${service}: ${price}`)
      .join('\n');
  };

  // 確定診所類型標籤的顏色
  const getTypeColor = () => {
    if (clinic.type.includes('NGO')) return 'bg-green-600';
    return 'bg-primary';
  };

  return (
    <div className="bg-[#111] border border-[#ffbb66]/30 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* 最上方的橘色條 */}
      <div className="h-1 w-full bg-[#ffaa40]"></div>
      
      {/* 診所名稱和類型 */}
      <div className="pt-4 pl-4 pr-4 flex justify-between items-start">
        <h4 className="font-bold text-lg mb-2 text-[#ffaa40] tracking-wide">{clinic.name}</h4>
        <div className="flex items-center space-x-2">
          {clinic.region_en && clinic.region_code && (
            <span className="text-[#94a3b8] text-xs">{clinic.region_en}</span>
          )}
          <div className={`${getTypeColor()} text-white px-2 py-1 text-sm font-medium rounded-md`}>
            {clinic.type}
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0">
        {/* 診所地址 */}
        <p className="text-[#ffaa40] text-sm mb-3 line-clamp-2">{clinic.address}</p>
        
        {/* 診所詳細信息 */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-[#ffaa40] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-[#94a3b8] text-sm">{clinic.region}</span>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-[#ffaa40] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-[#94a3b8] text-sm">{formatPhone(clinic.phone)}</span>
          </div>
          
          {/* 營業時間（可展開） */}
          <ExpandableText 
            label="營業時間"
            content={formatHours(clinic.hours)}
            icon={<Clock className="h-5 w-5 text-[#ffaa40]" />}
          />
          
          {/* 價格信息（可展開） */}
          {clinic.prices && (
            <ExpandableText 
              label="價格信息"
              content={formatPrices(clinic.prices) || '無價格信息'}
              icon={<DollarSign className="h-5 w-5 text-[#ffaa40]" />}
            />
          )}
        </div>
        
        {/* 大眾評分與連鎖經營顯示（針對大灣區診所） - 這部分在地圖按鈕前面 */}
        {clinic.isGreaterBayArea && (clinic.rating || clinic.isChain || clinic.is_chain) && (
          <div className="mb-3 flex flex-wrap justify-between items-center p-2 bg-[#1a1a1a] rounded-lg border border-[#333]">
            {clinic.rating && (
              <div className="flex items-center text-[#ffaa40]">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">大眾評分: {clinic.rating}</span>
              </div>
            )}
            
            {(clinic.isChain || clinic.is_chain) && (
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                連鎖經營
              </div>
            )}
          </div>
        )}
        
        {/* 地圖按鈕 */}
        <div className="flex space-x-2">
          {/* 內部Leaflet地圖按鈕 */}
          <button
            onClick={() => setIsMapOpen(true)}
            className="flex-1 bg-[#ffaa40]/10 hover:bg-[#ffaa40]/20 text-[#ffaa40] font-medium py-2 px-4 rounded text-center transition border border-[#ffbb66]/30"
          >
            <span className="flex items-center justify-center">
              <Map className="h-4 w-4 mr-2" />
              在地圖查看
            </span>
          </button>
          
          {/* 有經緯度定位的診所顯示高德地圖定位按鈕 */}
          {clinic.location && clinic.location.lat && clinic.location.lng && (
            <a
              href={generateAmapMarkerUrl(clinic) || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#ffaa40]/10 hover:bg-[#ffaa40]/20 text-[#ffaa40] font-medium py-2 px-4 rounded text-center transition border border-[#ffbb66]/30"
            >
              <span className="flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-2" />
                定位至高德地圖
              </span>
            </a>
          )}
          
          {/* 無經緯度定位的診所顯示地圖搜尋 */}
          {(!clinic.location || !clinic.location.lat || !clinic.location.lng) && (
            <a 
              href={clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門'
                    ? generateAmapSearchUrl(clinic.address)
                    : `https://maps.google.com/?q=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 bg-[#ffaa40]/10 hover:bg-[#ffaa40]/20 text-[#ffaa40] font-medium py-2 px-4 rounded text-center transition border border-[#ffbb66]/30"
            >
              <span className="flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-2" />
                {clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門' 
                  ? '在高德地圖查看' 
                  : '在Google Maps查看'}
              </span>
            </a>
          )}
        </div>
        
        {/* 地圖提示 */}
        {!clinic.location && (
          <p className="text-xs text-red-500 mt-2">
            地圖未能開啟？請複製地址於 Google 或百度地圖搜尋。
          </p>
        )}

        {/* 報錯按鈕 */}
        <div className="mt-4 pt-3 border-t border-[#ffbb66]/20 text-center">
          <button 
            onClick={() => window.location.href = `/report?clinic=${encodeURIComponent(clinic.name)}`}
            className="text-[#94a3b8] text-xs hover:text-[#ffaa40] transition-colors"
          >
            診所資料有誤？點此回報
          </button>
        </div>
      </div>
      
      {/* 地圖對話框 */}
      <MapDialog 
        clinic={clinic}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />
    </div>
  );
};

export default ClinicCard;