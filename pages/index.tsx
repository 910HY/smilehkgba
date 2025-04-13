import React, { useState, useEffect } from "react";
import Head from 'next/head';
import Header from "../client/src/components/Header";
import SearchPanel from "../client/src/components/SearchPanel";
import ClinicCard from "../client/src/components/ClinicCard";
import NoResults from "../client/src/components/NoResults";
import Footer from "../client/src/components/Footer";
import Pagination from "../client/src/components/Pagination";
import LatestArticles from "../client/src/components/LatestArticles";
import LatestPromotions from "../client/src/components/LatestPromotions";
import { Toaster } from "../client/src/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { fetchClinicData } from "../lib/clinic-data";
import { detailedRegions } from "../lib/regions";
import type { Clinic } from "../types/clinic";

export default function Home() {
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
  }, [clinics, hasSearched, searchParams]);

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
            // 針對深圳地區，處理簡繁體字差異，支持多種形式的區域名稱匹配
            const isRegionMatch = () => {
              // 檢查完全匹配（直接比較）
              if (clinic.region === params.subRegion) {
                return true;
              }
              
              // 針對可能的簡體字差異（例如：区 vs 區）
              const simplifiedRegion = params.subRegion.replace('區', '区');
              if (clinic.region === simplifiedRegion) {
                return true;
              }
              
              // 檢查模糊匹配（地址或其他屬性中包含該區域名稱）
              if (clinic.address && clinic.address.includes(params.subRegion)) {
                return true;
              }
              
              // 檢查區域字段中包含區域名稱的部分匹配
              const regionName = params.subRegion.replace('區', '').replace('区', '');
              if (clinic.region && clinic.region.includes(regionName)) {
                return true;
              }
              
              // 檢查地址中包含區域名稱（不帶"區"字）
              if (clinic.address && clinic.address.includes(regionName)) {
                return true;
              }
              
              return false;
            };
            
            return (clinic.isGreaterBayArea || clinic.country === '中國') && isRegionMatch();
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
          clinic.region.includes(keyword) || (clinic.address && clinic.address.includes(keyword))
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
    <>
      <Head>
        <title>牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      
      <div className="bg-black min-h-screen font-sans text-[#ffaa40]">
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
                <h3 className="text-[#ffaa40] text-xl font-bold">搜尋結果</h3>
                <p className="text-[#ffbb66]">
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
            <div className="py-16 text-center max-w-6xl mx-auto">
              {!hasSearched ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-[rgba(255,122,0,0.1)] p-6 rounded-full mb-6">
                    <img 
                      src={`/logo.png?v=${Date.now()}`} 
                      alt="牙GoGo Logo" 
                      className="h-16 w-16" 
                    />
                  </div>
                  <h2 className="text-[#FF7A00] text-4xl font-bold mb-2">
                    牙GoGo
                  </h2>
                  <p className="text-[#FF9D45] text-xl mb-6">
                    至關心你啲牙既牙科資訊平台
                  </p>
                  <p className="text-[#94a3b8] max-w-lg mb-8 text-lg">
                    請使用上方搜尋欄位尋找香港及大灣區的牙科診所資訊。
                  </p>
                </div>
              ) : (
                <NoResults hasSearched={true} />
              )}
            </div>
          )}
          
          {/* 在首頁添加最新文章區塊 */}
          <LatestArticles limit={3} />
          
          {/* 在首頁添加最新優惠區塊 */}
          <LatestPromotions limit={3} />
          
          <Footer />
        </div>
        <Toaster />
      </div>
    </>
  );
}