import React from 'react';
import { Search, MapPin, ArrowDown } from 'lucide-react';

interface NoResultsProps {
  hasSearched?: boolean;
}

// 定義樣式 - 使用原始橙色FF7A00
const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5rem 0',
  textAlign: 'center' as const,
  maxWidth: '1200px',
  margin: '0 auto'
};

const iconContainerStyle = {
  backgroundColor: 'rgba(255, 122, 0, 0.1)',
  padding: '1.5rem',
  borderRadius: '9999px',
  marginBottom: '1.5rem'
};

const titleStyle = {
  color: '#FF7A00',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  letterSpacing: '0.05em'
};

const textStyle = {
  color: '#94a3b8',
  maxWidth: '36rem',
  marginBottom: '1rem',
  fontSize: '1.1rem'
};

const bounceStyle = {
  animation: 'bounce 1s infinite',
  color: '#FF9D45'
};

const WelcomeMessage = () => (
  <div style={containerStyle}>
    <div style={iconContainerStyle}>
      <MapPin size={48} color="#FF7A00" />
    </div>
    <h3 style={titleStyle} className="brand-title">歡迎使用牙GoGo</h3>
    <p style={textStyle}>
      請使用上方搜尋欄位尋找香港及大灣區的牙科診所資訊。
    </p>
    <div style={bounceStyle}>
      <ArrowDown size={24} />
    </div>
  </div>
);

const EmptySearchResults = () => (
  <div style={containerStyle}>
    <div style={iconContainerStyle}>
      <Search size={48} color="#FF7A00" />
    </div>
    <h3 style={titleStyle}>未找到符合條件的診所</h3>
    <p style={textStyle}>
      請嘗試調整您的搜尋條件，例如選擇不同的區域或移除部分篩選條件。
    </p>
  </div>
);

const NoResults: React.FC<NoResultsProps> = ({ hasSearched = false }) => {
  // 如果尚未搜尋，顯示歡迎信息
  if (!hasSearched) {
    return <WelcomeMessage />;
  }
  
  // 否則顯示無結果的信息
  return <EmptySearchResults />;
};

export default NoResults;