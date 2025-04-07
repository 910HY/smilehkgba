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
      // 篩選區域
      if (params.region) {
        // 大灣區特殊處理
        if (params.region === '大灣區') {
          if (!clinic.isGreaterBayArea && clinic.country !== '中國' && clinic.country !== '澳門') {
            return false;
          }
        } 
        // 香港島
        else if (params.region === '香港島') {
          if (clinic.isGreaterBayArea) return false;
          
          // 檢查地區是否包含香港島關鍵字
          const isHKIsland = clinic.region.includes('香港島') || 
                            clinic.region.includes('港島') || 
                            clinic.address.includes('香港島');
          
          // 檢查是否屬於香港島的任一地區
          const isInHKDistrict = ['中西區', '灣仔區', '東區', '南區'].some(r => 
            clinic.region.includes(r) || clinic.address.includes(r)
          );
          
          // 檢查是否包含香港島細分地區的關鍵字
          const hasHKKeywords = [
            '中環', '上環', '西營盤', '堅尼地城', // 中西區
            '灣仔', '金鐘', '銅鑼灣', '跑馬地', // 灣仔區
            '北角', '太古', '筲箕灣', '柴灣', '西灣河', // 東區
            '香港仔', '黃竹坑', '鴨脷洲', '赤柱' // 南區
          ].some(k => clinic.address.includes(k) || clinic.region.includes(k));
          
          if (!isHKIsland && !isInHKDistrict && !hasHKKeywords) {
            return false;
          }
        }
        // 九龍
        else if (params.region === '九龍') {
          if (clinic.isGreaterBayArea) return false;
          
          // 檢查地區是否包含九龍關鍵字
          const isKowloon = clinic.region.includes('九龍') || 
                          clinic.address.includes('九龍');
          
          // 檢查是否屬於九龍的任一地區
          const isInKowloonDistrict = ['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'].some(r => 
            clinic.region.includes(r) || clinic.address.includes(r)
          );
          
          // 檢查是否包含九龍細分地區的關鍵字
          const hasKowloonKeywords = [
            '油麻地', '佐敦', '尖沙咀', '旺角', // 油尖旺
            '深水埗', '長沙灣', '石硤尾', '美孚', // 深水埗
            '九龍城', '何文田', '九龍塘', '新蒲崗', // 九龍城
            '黃大仙', '慈雲山', '樂富', // 黃大仙
            '觀塘', '牛頭角', '秀茂坪', '藍田' // 觀塘
          ].some(k => clinic.address.includes(k) || clinic.region.includes(k));
          
          if (!isKowloon && !isInKowloonDistrict && !hasKowloonKeywords) {
            return false;
          }
        }
        // 新界
        else if (params.region === '新界') {
          if (clinic.isGreaterBayArea) return false;
          
          // 檢查地區是否包含新界關鍵字
          const isNT = clinic.region.includes('新界') || 
                      clinic.address.includes('新界');
          
          // 檢查是否屬於新界的任一地區
          const isInNTDistrict = ['西區', '北區', '新界東區', '中區', '離島區',
                              '荃灣', '屯門', '元朗', '上水', '粉嶺', '大埔', 
                              '將軍澳', '西貢', '沙田', '葵涌', '青衣', '東涌'].some(r => 
            clinic.region.includes(r) || clinic.address.includes(r)
          );
          
          // 檢查是否包含新界細分地區的關鍵字
          const hasNTKeywords = [
            '荃灣', '屯門', '元朗', '天水圍', // 西區
            '上水', '粉嶺', '大埔', // 北區
            '將軍澳', '西貢', '馬鞍山', // 東區
            '沙田', '葵涌', '青衣', // 中區
            '東涌', '長洲', '梅窩', '大嶼山' // 離島
          ].some(k => clinic.address.includes(k) || clinic.region.includes(k));
          
          if (!isNT && !isInNTDistrict && !hasNTKeywords) {
            return false;
          }
        }
      }

      // 篩選細分地區
      if (params.subRegion) {
        // 檢查是否直接匹配細分地區名稱
        const directMatch = clinic.region.includes(params.subRegion) || 
                           clinic.address.includes(params.subRegion);
        
        // 檢查是否匹配該細分地區下的任一關鍵字地點
        let keywordMatch = false;
        // 使用類型斷言來處理索引類型問題
        const subRegionKeywords = detailedRegions[params.subRegion as keyof typeof detailedRegions];
        if (subRegionKeywords) {
          keywordMatch = subRegionKeywords.some((keyword: string) => 
            clinic.address.includes(keyword) || clinic.region.includes(keyword)
          );
        }
        
        if (!directMatch && !keywordMatch) {
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
