import React, { useState, useEffect } from 'react';
import { regions, detailedRegions } from '../lib/regions';

interface SearchPanelProps {
  onSearch: (params: {
    region: string;
    subRegion: string;
    clinicType: string;
    keyword: string;
  }) => void;
}

export default function SearchPanel({ onSearch }: SearchPanelProps) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubRegion, setSelectedSubRegion] = useState('');
  const [selectedClinicType, setSelectedClinicType] = useState('');
  const [keyword, setKeyword] = useState('');
  const [subRegions, setSubRegions] = useState<string[]>([]);

  // 當選擇的地區變化時，更新可選的細分區域
  useEffect(() => {
    if (selectedRegion && regions[selectedRegion as keyof typeof regions]) {
      setSubRegions(regions[selectedRegion as keyof typeof regions]);
      setSelectedSubRegion(''); // 重置子區域
    } else {
      setSubRegions([]);
    }
  }, [selectedRegion]);

  // 處理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      region: selectedRegion,
      subRegion: selectedSubRegion,
      clinicType: selectedClinicType,
      keyword: keyword,
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-10 shadow-lg">
      <h2 className="text-2xl font-bold text-[#ffaa40] mb-4">尋找牙科診所</h2>
      
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* 地區選擇 */}
          <div>
            <label htmlFor="region" className="block text-[#ffbb66] mb-2 text-sm font-medium">
              地區
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-[#ffaa40] focus:border-[#ffaa40] text-white"
            >
              <option value="">所有地區</option>
              <option value="香港島">香港島</option>
              <option value="九龍">九龍</option>
              <option value="新界">新界</option>
              <option value="大灣區">大灣區</option>
            </select>
          </div>

          {/* 細分區域選擇 */}
          <div>
            <label htmlFor="subRegion" className="block text-[#ffbb66] mb-2 text-sm font-medium">
              細分區域
            </label>
            <select
              id="subRegion"
              value={selectedSubRegion}
              onChange={(e) => setSelectedSubRegion(e.target.value)}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-[#ffaa40] focus:border-[#ffaa40] text-white"
              disabled={!selectedRegion || subRegions.length === 0}
            >
              <option value="">選擇細分區域</option>
              {subRegions.map((subRegion) => (
                <option key={subRegion} value={subRegion}>
                  {subRegion}
                </option>
              ))}
            </select>
          </div>

          {/* 診所類型選擇 */}
          <div>
            <label htmlFor="clinicType" className="block text-[#ffbb66] mb-2 text-sm font-medium">
              診所類型
            </label>
            <select
              id="clinicType"
              value={selectedClinicType}
              onChange={(e) => setSelectedClinicType(e.target.value)}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-[#ffaa40] focus:border-[#ffaa40] text-white"
            >
              <option value="">所有類型</option>
              <option value="私家診所">私家診所</option>
              <option value="NGO社企">NGO社企</option>
            </select>
          </div>

          {/* 關鍵字搜索 */}
          <div>
            <label htmlFor="keyword" className="block text-[#ffbb66] mb-2 text-sm font-medium">
              關鍵字
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="診所名稱、地址或電話"
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-[#ffaa40] focus:border-[#ffaa40] text-white"
            />
          </div>
        </div>

        {/* 搜索按鈕 */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#FF7A00] hover:bg-[#FF9D45] text-white font-medium rounded-lg transition-colors"
          >
            搜尋診所
          </button>
        </div>
      </form>
    </div>
  );
}