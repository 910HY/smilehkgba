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
    '私家診所': <Building className="h-5 w-5 text-blue-600" />,
    'NGO社企': <Stethoscope className="h-5 w-5 text-green-600" />,
    '全部': <HeartPulse className="h-5 w-5 text-primary" />
  };
  
  // 選擇診所圖像（以診所的名稱或類型計算一個一致的索引）
  const clinicImages = [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559126012-17aac90034c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588776813941-1e16a942b3e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1601316712907-1eaf4a6268e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  ];

  // 使用診所名稱哈希來確保同一診所每次顯示相同圖像
  const getImageIndex = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash |= 0; // 轉換為32位整數
    }
    return Math.abs(hash) % clinicImages.length;
  };

  const clinicImage = clinicImages[getImageIndex(clinic.name)];
  
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img 
          src={clinicImage} 
          alt={`${clinic.name} 外觀`} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-0 right-0 ${getTypeColor()} text-white px-2 py-1 text-sm font-medium rounded-bl-md`}>
          {clinic.type}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2 text-primary-text">{clinic.name}</h4>
        <p className="text-secondary-text text-sm mb-3 line-clamp-2">{clinic.address}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-secondary-text text-sm">{clinic.region}</span>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-secondary-text text-sm">{formatPhone(clinic.phone)}</span>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-secondary-text text-sm">{formatHours(clinic.hours)}</span>
          </div>
          
          {/* 顯示價格（如果有）（針對大灣區診所） */}
          {clinic.prices && clinic.prices.洗牙 && (
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-secondary-text text-sm">
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
