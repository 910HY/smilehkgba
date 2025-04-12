import React, { useState, useEffect } from 'react';
import { regions, detailedRegions, clinicTypes } from '../lib/regions';

interface SearchPanelProps {
  onSearch: (params: {
    region: string;
    subRegion: string;
    clinicType: string;
    keyword: string;
  }) => void;
}

export default function SearchPanel({ onSearch }: SearchPanelProps) {
  const [selectedMainRegion, setSelectedMainRegion] = useState<string>('香港');
  const [selectedRegion, setSelectedRegion] = useState<string>('全部');
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('全部');
  const [selectedClinicType, setSelectedClinicType] = useState<string>('全部');
  const [keyword, setKeyword] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [subRegions, setSubRegions] = useState<string[]>([]);

  // 當主要區域改變時，更新子區域選項
  useEffect(() => {
    if (selectedMainRegion === '全部') {
      setSubRegions([]);
    } else if (selectedMainRegion in detailedRegions) {
      setSubRegions(['全部', ...detailedRegions[selectedMainRegion]]);
    } else {
      setSubRegions(['全部']);
    }
    setSelectedRegion('全部');
    setSelectedSubRegion('全部');
  }, [selectedMainRegion]);

  // 處理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      region: selectedRegion === '全部' ? selectedMainRegion : selectedRegion,
      subRegion: selectedSubRegion,
      clinicType: selectedClinicType,
      keyword,
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <form onSubmit={handleSearch}>
        <div className="space-y-4">
          {/* 搜索框 */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="輸入診所名稱、地址或關鍵詞..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ff7a00] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-[#ff7a00] text-white p-1 rounded-lg"
              >
                <span className="px-3 py-1">搜尋</span>
              </button>
            </div>
          </div>

          {/* 地區篩選 */}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-gray-300 mr-2">篩選條件</span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[#ffbb66] text-sm hover:underline focus:outline-none"
              >
                {showAdvanced ? '收起' : '展開'}
              </button>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 主要區域選擇 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">地區</label>
                  <select
                    value={selectedMainRegion}
                    onChange={(e) => setSelectedMainRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-1 focus:ring-[#ff7a00] focus:outline-none"
                  >
                    <option value="全部">全部地區</option>
                    {Object.keys(regions).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 子地區選擇 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">子區域</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-1 focus:ring-[#ff7a00] focus:outline-none"
                    disabled={selectedMainRegion === '全部' || !subRegions.length}
                  >
                    {subRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 診所類型選擇 */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">診所類型</label>
                  <select
                    value={selectedClinicType}
                    onChange={(e) => setSelectedClinicType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-1 focus:ring-[#ff7a00] focus:outline-none"
                  >
                    {clinicTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 搜索按鈕 */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#ff7a00] text-white rounded-md hover:bg-[#ff9530] transition-colors"
                  >
                    套用篩選
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}