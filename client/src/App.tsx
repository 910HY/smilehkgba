import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import ClinicCard from "./components/ClinicCard";
import NoResults from "./components/NoResults";
import Footer from "./components/Footer";
import Pagination from "./components/Pagination";
import ReportPage from "./pages/ReportPage";
import NotFound from "./pages/not-found";
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
  
  // 新增一個搜索標記，用來判斷用戶是否進行過搜索
  const [hasSearched, setHasSearched] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 懶加載數據 - 只有在用戶搜索時才獲取
  const { data: clinics = [], isLoading, isFetching } = useQuery({
    queryKey: ['/api/clinics'],
    queryFn: fetchClinicData,
    enabled: hasSearched, // 只有在用戶搜索時才啟用查詢
  });

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  
  // 當診所數據加載完成後，自動執行篩選
  useEffect(() => {
    if (hasSearched && clinics.length > 0) {
      filterResults(searchParams);
    }
  }, [clinics, hasSearched]);

  // 篩選診所的邏輯函數
  const filterResults = (params: {
    region: string;
    subRegion: string;
    clinicType: string;
    keyword: string;
  }) => {
    console.log("執行篩選，參數:", params);
    
    // 依據搜尋參數篩選診所
    const filtered = clinics.filter((clinic) => {
      // 檢查大區域匹配
      let regionMatch = true;
      if (params.region) {
        // 大灣區特殊處理
        if (params.region === '大灣區') {
          // 如果選擇了細分地區（某個深圳行政區），進行更精細的過濾
          if (params.subRegion) {
            return (clinic.isGreaterBayArea || clinic.country === '中國') && 
                   (clinic.region === params.subRegion || clinic.address.includes(params.subRegion));
          }
          // 否則顯示所有大灣區診所
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
          clinic.region.includes(keyword) || clinic.address.includes(keyword)
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
          typeMatch = !clinic.type.includes('NGO');
        } else if (params.clinicType === 'NGO社企') {
          typeMatch = clinic.type.includes('NGO');
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
  
  // 處理用戶搜索請求
  const handleSearch = (params: {
    region: string;
    subRegion: string;
    clinicType: string;
    keyword: string;
  }) => {
    // 設置搜索參數
    setSearchParams(params);
    setCurrentPage(1);
    
    // 標記已經搜索
    setHasSearched(true);
    
    console.log("搜尋參數:", params);
    
    // 如果已有診所數據，直接篩選
    if (clinics.length > 0) {
      filterResults(params);
    }
    // 否則 useQuery 會因為 enabled: hasSearched 變為 true 而自動開始加載數據
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
            
            {isLoading ? (
              <div className="text-center py-20">
                <div className="text-white text-xl">載入中...</div>
              </div>
            ) : hasSearched && filteredClinics.length > 0 ? (
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
              <NoResults hasSearched={hasSearched} />
            )}
            
            <Footer />
          </div>
        </Route>
        
        <Route>
          <NotFound />
        </Route>
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;