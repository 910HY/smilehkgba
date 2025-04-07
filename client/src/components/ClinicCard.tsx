import React from 'react';
import { Clinic } from '../types/clinic';
import { 
  MapPin, Phone, Clock, DollarSign, Navigation,
  Stethoscope, Building, HeartPulse
} from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
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

  // 根據位置生成適當的地圖連結
  const getMapLink = () => {
    if (clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門') {
      // 對於大灣區，使用高德地圖
      return `https://uri.amap.com/marker?name=${encodeURIComponent(clinic.name)}&address=${encodeURIComponent(clinic.address)}`;
    } else {
      // 對於香港，使用Google Maps
      return `https://maps.google.com/?q=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`;
    }
  };

  // 格式化營業時間以便顯示
  const formatHours = (hours: string) => {
    if (!hours || hours === '-') return '詳情請致電查詢';
    // 如果太長則縮短
    if (hours.length > 50) {
      return hours.substring(0, 47) + '...';
    }
    return hours;
  };

  // 確定診所類型標籤的顏色
  const getTypeColor = () => {
    if (clinic.type.includes('NGO')) return 'bg-green-600';
    return 'bg-primary';
  };

  return (
    <div className="bg-[#2B1B0F] border border-primary/30 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="pt-4 pl-4 pr-4 flex justify-between items-start">
        <h4 className="font-bold text-lg mb-2 text-primary tracking-wide">{clinic.name}</h4>
        <div className={`${getTypeColor()} text-white px-2 py-1 text-sm font-medium rounded-md`}>
          {clinic.type}
        </div>
      </div>
      <div className="p-4 pt-0">
        <p className="text-primary text-sm mb-3 line-clamp-2">{clinic.address}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-primary text-sm">{clinic.region}</span>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-primary text-sm">{formatPhone(clinic.phone)}</span>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-primary text-sm">{formatHours(clinic.hours)}</span>
          </div>
          
          {/* 顯示價格（如果有）（針對大灣區診所） */}
          {clinic.prices && clinic.prices.洗牙 && (
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-primary text-sm">
                {clinic.prices.洗牙 && <div>洗牙: {clinic.prices.洗牙}</div>}
                {clinic.prices.補牙 && <div>補牙: {clinic.prices.補牙}</div>}
              </div>
            </div>
          )}
        </div>
        
        <a 
          href={getMapLink()} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded text-center transition"
        >
          <span className="flex items-center justify-center">
            <Navigation className="h-4 w-4 mr-2" />
            {clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門' 
              ? '在高德地圖查看' 
              : '在Google Maps查看'}
          </span>
        </a>
      </div>
    </div>
  );
};

export default ClinicCard;
