import React, { useState } from 'react';
import { Clinic } from '../types/clinic';
import { 
  MapPin, Phone, Clock, DollarSign, Map, Star,
  Navigation, Stethoscope, Building, HeartPulse, Award, Shield
} from 'lucide-react';
import MapDialog from './MapDialog';
import ExpandableText from './ExpandableText';
import { generateAmapSearchUrl } from '../lib/generateAmapLink';

// 生成高德地圖標記URL
function generateAmapMarkerUrl(clinic: Clinic): string | null {
  if (!clinic.location || !clinic.location.lng || !clinic.location.lat) return null;

  const { lng, lat } = clinic.location;
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(clinic.name)}&callnative=0`;
}

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // 每個診所類型對應的圖標和顏色
  const clinicTypeIcons = {
    '私家診所': <Building className="h-5 w-5 text-primary" />,
    'NGO社企': <Stethoscope className="h-5 w-5 text-primary" />,
    '全部': <HeartPulse className="h-5 w-5 text-primary" />
  };
  
  // 格式化電話號碼以便顯示
  const formatPhone = (phone: string | number) => {
    if (!phone) return '無提供';
    
    if (typeof phone === 'number') {
      return phone.toString().replace(/(\d{4})(\d{4})/, '$1 $2');
    }
    
    // 嘗試將字符串格式化為更易讀的形式
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

  // 檢查各種可能的條件
  const isFiltered = !!clinic.isFiltered;
  const isHighRated = !!clinic.isHighRated;
  const isHighlighted = !!clinic.highlight;
  const isChain = !!clinic.is_chain;
  const hasRating = clinic.rating !== undefined && typeof clinic.rating === 'number';
  const hasHighRating = hasRating && clinic.rating !== undefined && clinic.rating >= 4.5;
  
  // 確定是否顯示高亮邊框（優質診所）
  const cardBorderClass = isFiltered || isHighRated || isHighlighted || hasHighRating || isChain
    ? "border-[#ff9020] border-2" 
    : "border-[#ffbb66]/30 border";

  // 判斷診所類型顯示文字
  const getQualityLabel = () => {
    if (isChain) return '連鎖品牌診所';
    if (hasHighRating && hasRating && clinic.rating !== undefined) {
      return `評分 ${clinic.rating}⭐ 優質推薦`;
    }
    return '優質診所推薦';
  };

  // 判斷是否顯示優質標記
  const shouldShowQualityLabel = isFiltered || isHighRated || isHighlighted || hasHighRating || isChain;

  return (
    <div className={`bg-[#111] ${cardBorderClass} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}>
      {/* 優質診所標記 */}
      {shouldShowQualityLabel && (
        <div className="bg-gradient-to-r from-[#ff9020] to-[#ffaa40] text-black px-4 py-1 text-xs font-bold">
          {getQualityLabel()}
        </div>
      )}
      
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
        {/* 評分顯示 */}
        {clinic.rating && (
          <div className="flex items-center mb-2">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="#FFBB33" />
            <span className="text-yellow-500 font-medium">大眾評分: {clinic.rating}</span>
            {clinic.is_chain && (
              <div className="flex items-center ml-2">
                <Shield className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-500 text-xs font-medium">連鎖經營</span>
              </div>
            )}
          </div>
        )}
        
        {/* 使用ExpandableText顯示地址，永遠顯示完整內容 */}
        <ExpandableText 
          label="診所地址"
          content={clinic.address}
          icon={<MapPin className="h-5 w-5 text-[#ffaa40]" />}
          alwaysShowFull={true}
        />
        
        <div className="space-y-2 mb-4">
          {/* 區域信息（可展開） */}
          <ExpandableText 
            label="所屬區域"
            content={clinic.region}
            icon={<MapPin className="h-5 w-5 text-[#ffaa40]" />}
          />
          
          {/* 電話信息（可展開） */}
          <ExpandableText 
            label="聯絡電話"
            content={formatPhone(clinic.phone)}
            icon={<Phone className="h-5 w-5 text-[#ffaa40]" />}
          />
          
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
          
          {/* 提供的服務（如果有） */}
          {clinic.services && clinic.services.length > 0 && (
            <ExpandableText 
              label="提供服務"
              content={clinic.services.join('、')}
              icon={<Award className="h-5 w-5 text-[#ffaa40]" />}
            />
          )}
        </div>
        
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