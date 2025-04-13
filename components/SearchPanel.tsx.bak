import React, { useState, useEffect } from 'react';
import { regions, RegionMapping, clinicTypes, regionDisplayNames, detailedRegions, DetailedRegionMapping, ntRegionGroups } from '../lib/regions';

interface SearchPanelProps {
  onSearch: (params: {
    region: string;
    subRegion: string;
    clinicType: string;
    keyword: string;
  }) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubRegion, setSelectedSubRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [keyword, setKeyword] = useState('');
  const [subRegions, setSubRegions] = useState<string[]>([]);

  useEffect(() => {
    // 當區域改變時更新細分地區
    if (!selectedRegion) {
      setSubRegions([]);
    } 
    // 如果選擇了「大灣區」，細分選單顯示這 10 個行政區
    else if (selectedRegion === '大灣區') {
      const szRegions = ['福田區', '南山區', '羅湖區', '鹽田區', '大鵬新區', '龍華區', '龍崗區', '寶安區', '坪山區', '光明區'];
      setSubRegions(szRegions);
    }
    // 其他區域使用預設的區域映射
    else if (regions[selectedRegion as keyof RegionMapping]) {
      setSubRegions(regions[selectedRegion as keyof RegionMapping]);
    } else {
      setSubRegions([]);
    }
    setSelectedSubRegion('');
  }, [selectedRegion]);

  const handleSearch = () => {
    onSearch({
      region: selectedRegion,
      subRegion: selectedSubRegion,
      clinicType: selectedType,
      keyword: keyword,
    });
  };

  // 按鍵盤 Enter 鍵觸發搜尋
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-panel">
      <h2>搜尋牙科診所</h2>
      <div className="filters">
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">全部地區</option>
          {Object.keys(regions).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        
        <select
          value={selectedSubRegion}
          onChange={(e) => setSelectedSubRegion(e.target.value)}
          disabled={!selectedRegion}
        >
          <option value="">全部細分地區</option>
          {selectedRegion === '新界' ? (
            ntRegionGroups['新界'].map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.regions.map(subRegion => (
                  <option key={subRegion} value={subRegion}>
                    {subRegion}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            subRegions.map((subRegion) => (
              <option key={subRegion} value={subRegion}>
                {subRegion}
              </option>
            ))
          )}
        </select>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">全部類型</option>
          {clinicTypes.slice(1).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="診所名稱／地址／電話"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <button onClick={handleSearch} className="flex justify-center items-center w-full">搜尋</button>
      </div>
    </div>
  );
};

export default SearchPanel;
