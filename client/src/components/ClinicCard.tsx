import React from 'react';
import { Clinic } from '../types/clinic';

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  // Select a random clinic image
  const clinicImages = [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559126012-17aac90034c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588776813941-1e16a942b3e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1601316712907-1eaf4a6268e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  ];

  const randomImage = clinicImages[Math.floor(Math.random() * clinicImages.length)];
  
  // Format phone number for display
  const formatPhone = (phone: string | number) => {
    if (typeof phone === 'number') {
      return phone.toString().replace(/(\d{4})(\d{4})/, '$1 $2');
    }
    return phone;
  };

  // Generate appropriate map link based on isGreaterBayArea flag
  const getMapLink = () => {
    if (clinic.isGreaterBayArea) {
      // For Greater Bay Area, use Amap (高德地图)
      // Note: This is a simplified example, in a real app you'd want to properly encode and add coordinates
      return `https://uri.amap.com/marker?name=${encodeURIComponent(clinic.name)}&address=${encodeURIComponent(clinic.address)}`;
    } else {
      // For Hong Kong, use Google Maps
      return `https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`;
    }
  };

  // Format hours for display
  const formatHours = (hours: string) => {
    if (!hours || hours === '-') return '詳情請致電查詢';
    // Shorten hours if too long
    if (hours.length > 50) {
      return hours.substring(0, 47) + '...';
    }
    return hours;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img 
          src={randomImage} 
          alt="診所外觀" 
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-0 right-0 ${clinic.type === 'NGO/社企' ? 'bg-green-600' : 'bg-primary'} text-white px-2 py-1 text-sm`}>
          {clinic.type}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2">{clinic.name}</h4>
        <p className="text-textSecondary text-sm mb-3">{clinic.address}</p>
        <div className="flex items-center mb-2">
          <i className="fas fa-map-marker-alt text-primary mr-2"></i>
          <span className="text-textSecondary text-sm">{clinic.region}</span>
        </div>
        <div className="flex items-center mb-2">
          <i className="fas fa-phone-alt text-primary mr-2"></i>
          <span className="text-textSecondary text-sm">{formatPhone(clinic.phone)}</span>
        </div>
        <div className="flex items-center mb-2">
          <i className="fas fa-clock text-primary mr-2"></i>
          <span className="text-textSecondary text-sm">{formatHours(clinic.hours)}</span>
        </div>
        
        {/* Show prices if available (for Greater Bay Area clinics) */}
        {clinic.prices && clinic.prices.洗牙 && (
          <div className="flex items-center mb-4">
            <i className="fas fa-dollar-sign text-primary mr-2"></i>
            <span className="text-textSecondary text-sm">洗牙: {clinic.prices.洗牙}</span>
          </div>
        )}
        
        <a 
          href={getMapLink()} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full bg-gray-100 hover:bg-gray-200 text-textPrimary font-medium py-2 px-4 rounded text-center transition"
        >
          <i className="fas fa-directions mr-2"></i>
          {clinic.isGreaterBayArea ? '在高德地圖查看' : '在Google Maps查看'}
        </a>
      </div>
    </div>
  );
};

export default ClinicCard;
