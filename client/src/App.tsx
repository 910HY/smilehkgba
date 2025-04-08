import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import ClinicCard from "./components/ClinicCard";
import NoResults from "./components/NoResults";
import Footer from "./components/Footer";
import Pagination from "./components/Pagination";
import ReportPage from "./pages/ReportPage";
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
      // 檢查大區域匹配
      let regionMatch = true;
      if (params.region) {
        // 大灣區特殊處理
        if (params.region === '大灣區') {
          return clinic.isGreaterBayArea || clinic.country === '中國' || clinic.country === '澳門';
        }
        
        // 如果選擇了香港、九龍或新界，排除大灣區的診所
        if (clinic.isGreaterBayArea) {
          return false;
        }
        
        // 定義各區域包含的細分地區
        const regionSubDistricts: Record<string, string[]> = {
          '香港島': ['中西區', '灣仔區', '東區', '南區'],
          '九龍': ['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'],
          '新界': [
            '荃灣區', '屯門區', '元朗區', '北區', '大埔區', 
            '沙田區', '西貢區', '葵青區', '離島區'
          ]
        };
        
        // 檢查細分地區 - 僅檢查 clinic.region 是否等於區名或其簡稱
        const isInSubRegion = regionSubDistricts[params.region]?.some(district => {
          // 處理「區」字的匹配，例如「元朗區」和「元朗」
          const districtBase = district.replace('區', '');
          return clinic.region === district || clinic.region === districtBase;
        }) || false;
        
        // 設定區域匹配標誌 - 只依照區域精確匹配判斷
        regionMatch = isInSubRegion;
        if (!regionMatch) {
          return false;
        }
      }
      
      // 篩選細分地區 - 使用更靈活的匹配
      let subRegionMatch = true;
      if (params.subRegion) {
        // 1. 檢查精確匹配
        const exactMatch = clinic.region === params.subRegion;
        
        // 2. 檢查去掉「區」字的匹配 (如元朗區 vs 元朗)
        const noSuffixMatch = clinic.region === params.subRegion.replace('區', '');
        
        // 3. 檢查診所是否包含在此細分地區的關鍵字中
        const subRegionKeywords = detailedRegions[params.subRegion as keyof typeof detailedRegions];
        const keywordMatch = subRegionKeywords ? subRegionKeywords.some((keyword: string) => 
          clinic.region?.includes(keyword) || clinic.address.includes(keyword)
        ) : false;
        
        subRegionMatch = exactMatch || noSuffixMatch || keywordMatch;
        if (!subRegionMatch) {
          return false;
        }
      }
      
      // 篩選診所類型
      let typeMatch = true;
      if (params.clinicType) {
        if (params.clinicType === '私家診所') {
          typeMatch = !clinic.type?.includes('NGO');
        } else if (params.clinicType === 'NGO社企') {
          typeMatch = clinic.type?.includes('NGO') || false;
        }
        
        if (!typeMatch) {
          return false;
        }
      }
      
      // 篩選關鍵字
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
      
      // 如果通過以上所有篩選，返回 true
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
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a", color: "#FF7A00" }}>
      <Switch>
        <Route path="/report">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Header />
            <ReportPage />
            <Footer />
          </div>
        </Route>
        
        <Route path="/">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Header />
            
            <SearchPanel onSearch={handleSearch} />
            
            {/* 設計欄 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="design-column">
                <h3 className="design-title font-orbitron">精準定位</h3>
                <p className="design-desc">
                  結合高德地圖及Google地圖，為您提供香港及大灣區牙醫診所的精確位置資訊，便於快速尋找最近的診所。
                </p>
              </div>
              <div className="design-column">
                <h3 className="design-title font-orbitron">全面資訊</h3>
                <p className="design-desc">
                  包含診所營業時間、服務項目、收費標準及診所聯絡方式，讓您在選擇前了解所有必要信息。
                </p>
              </div>
              <div className="design-column">
                <h3 className="design-title font-orbitron">多元篩選</h3>
                <p className="design-desc">
                  依據地區、服務類型及關鍵字進行快速篩選，智能推薦最符合您需求的診所選擇。
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-20">
                <div className="text-white text-xl">載入中...</div>
              </div>
            ) : filteredClinics.length > 0 ? (
              <div id="searchResults" className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#FF7A00] text-xl font-bold font-orbitron">搜尋結果</h3>
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
        </Route>
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;
