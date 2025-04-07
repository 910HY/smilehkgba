import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import ClinicCard from "./components/ClinicCard";
import NoResults from "./components/NoResults";
import Footer from "./components/Footer";
import Pagination from "./components/Pagination";
import { Clinic } from "./types/clinic";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { fetchClinicData } from "./lib/clinic-data";
import { detailedRegions } from "./lib/regions";

function App() {
  const [searchParams, setSearchParams] = useState({
    region: "",
    subRegion: "",
    clinicType: "",
    keyword: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ['/api/clinics'],
    queryFn: fetchClinicData
  });

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    handleSearch(searchParams);
  }, [clinics, searchParams]);

  const handleSearch = (params: {
    region: string;
    subRegion: string;
    clinicType: string;
    keyword: string;
  }) => {
    setSearchParams(params);
    setCurrentPage(1);
    
    console.log("搜尋參數:", params);
    
    // 依據搜尋參數篩選診所
    const filtered = clinics.filter((clinic) => {
      // 大灣區特殊處理
      if (params.region === '大灣區') {
        // 只顯示屬於大灣區的診所
        return clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門';
      }
      
      // 如果選擇了香港、九龍或新界，排除大灣區的診所
      if (['香港島', '九龍', '新界'].includes(params.region) && clinic.isGreaterBayArea) {
        return false;
      }
      
      // 處理香港本地區域搜尋
      if (params.region && params.region !== '大灣區') {
        // 檢查診所是否屬於該區域
        const regionKeywords: Record<string, string[]> = {
          '香港島': ['香港島', '港島'],
          '九龍': ['九龍', 'Kowloon'],
          '新界': ['新界', 'New Territories', 'NT']
        };
        
        // 診所所屬區域檢查
        const isInRegion = regionKeywords[params.region]?.some(keyword => 
          clinic.region.includes(keyword) || clinic.address.includes(keyword)
        ) || false;
        
        // 檢查細分地區是否屬於該大區
        const regionSubDistricts: Record<string, string[]> = {
          '香港島': ['中西區', '灣仔區', '東區', '南區'],
          '九龍': ['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'],
          '新界': [
            '荃灣區', '屯門區', '元朗區', '北區', '大埔區', 
            '沙田區', '西貢區', '葵青區', '離島區'
          ]
        };
        
        const hasDistrictInRegion = regionSubDistricts[params.region]?.some(district => 
          clinic.region === district || clinic.region.includes(district)
        ) || false;
        
        // 如果診所既不在該區域也不在屬於該區域的子地區，則排除
        if (!isInRegion && !hasDistrictInRegion) {
          // 針對區域內的地名關鍵字再檢查一次
          // 檢查該區域的所有細分地區關鍵字
          const allDetailedRegionKeywords: string[] = [];
          
          regionSubDistricts[params.region]?.forEach(district => {
            const keywords = detailedRegions[district as keyof typeof detailedRegions] || [];
            allDetailedRegionKeywords.push(...keywords);
          });
          
          const hasAreaKeyword = allDetailedRegionKeywords.some(keyword => 
            clinic.address.includes(keyword) || clinic.region.includes(keyword)
          );
          
          if (!hasAreaKeyword) {
            return false;
          }
        }
      }

      // 篩選細分地區
      if (params.subRegion) {
        // 直接匹配 region 欄位 - 必須是精確匹配，不是部分包含
        const exactRegionMatch = clinic.region === params.subRegion;
        
        // 地址中包含該區名稱
        const addressContainsRegion = clinic.address.includes(params.subRegion);
        
        // 檢查是否匹配該細分地區下的任一關鍵字地點
        const subRegionKeywords = detailedRegions[params.subRegion as keyof typeof detailedRegions];
        const keywordMatch = subRegionKeywords ? subRegionKeywords.some((keyword: string) => 
          clinic.address.includes(keyword) || clinic.region.includes(keyword)
        ) : false;
        
        if (!exactRegionMatch && !addressContainsRegion && !keywordMatch) {
          return false;
        }
      }

      // 篩選診所類型
      if (params.clinicType) {
        if (params.clinicType === '私家診所' && clinic.type.includes('NGO')) {
          return false;
        }
        if (params.clinicType === 'NGO社企' && !clinic.type.includes('NGO')) {
          return false;
        }
      }

      // 篩選關鍵字（名稱、地址或電話）
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        const name = (clinic.name || '').toLowerCase();
        const address = (clinic.address || '').toLowerCase();
        const phone = typeof clinic.phone === 'number' 
          ? clinic.phone.toString() 
          : (clinic.phone || '').toLowerCase();

        return (
          name.includes(keyword) || 
          address.includes(keyword) || 
          phone.includes(keyword)
        );
      }

      return true;
    });
    
    console.log("篩選結果數量:", filtered.length);
    setFilteredClinics(filtered);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClinics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-background min-h-screen font-sans text-textPrimary">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        
        <SearchPanel onSearch={handleSearch} />
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-white text-xl">載入中...</div>
          </div>
        ) : filteredClinics.length > 0 ? (
          <div id="searchResults" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#FF7A00] text-xl font-bold">搜尋結果</h3>
              <p className="text-[#FDBA74]">
                共找到 <span className="font-bold">{filteredClinics.length}</span> 間診所
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((clinic, index) => (
                <ClinicCard key={index} clinic={clinic} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                paginate={paginate} 
              />
            )}
          </div>
        ) : (
          <NoResults />
        )}
        
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
