import React, { useState, useEffect } from 'react';
import { regions, RegionMapping, clinicTypes, regionDisplayNames } from '../lib/regions';

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
    if (selectedRegion && regions[selectedRegion as keyof RegionMapping]) {
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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold mb-4">搜尋牙科診所</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-secondary-text mb-2" htmlFor="region">區域分類</label>
          <select
            id="region"
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">全部區域</option>
            {Object.keys(regions).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-secondary-text mb-2" htmlFor="subRegion">細分地區</label>
          <select
            id="subRegion"
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedSubRegion}
            onChange={(e) => setSelectedSubRegion(e.target.value)}
            disabled={!selectedRegion}
          >
            <option value="">全部地區</option>
            {subRegions.map((subRegion) => (
              <option key={subRegion} value={subRegion}>
                {subRegion}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-secondary-text mb-2" htmlFor="clinicType">診所類型</label>
          <select
            id="clinicType"
            className="w-full p-2 border border-gray-300 rounded"
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
        </div>
        <div>
          <label className="block text-secondary-text mb-2" htmlFor="keyword">關鍵字搜尋</label>
          <input
            type="text"
            id="keyword"
            placeholder="輸入診所名稱/地址/電話"
            className="w-full p-2 border border-gray-300 rounded"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={handleSearch}
          className="bg-primary hover:bg-orange-500 text-white font-bold py-2 px-6 rounded transition"
        >
          搜尋
        </button>
      </div>
    </div>
  );
};

export default SearchPanel;
