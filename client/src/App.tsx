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

    // Filter clinics based on search parameters
    const filtered = clinics.filter((clinic) => {
      // Filter by region
      if (params.region && 
        ((params.region === "大灣區" && !clinic.isGreaterBayArea) || 
        (params.region !== "大灣區" && clinic.isGreaterBayArea) || 
        (params.region !== "大灣區" && clinic.region !== params.region))) {
        return false;
      }

      // Filter by sub-region
      if (params.subRegion && clinic.region !== params.subRegion) {
        return false;
      }

      // Filter by clinic type
      if (params.clinicType && clinic.type !== params.clinicType) {
        return false;
      }

      // Filter by keyword (name, address, or phone)
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        const name = clinic.name.toLowerCase();
        const address = clinic.address.toLowerCase();
        const phone = typeof clinic.phone === 'number' 
          ? clinic.phone.toString() 
          : clinic.phone.toLowerCase();

        return (
          name.includes(keyword) || 
          address.includes(keyword) || 
          phone.includes(keyword)
        );
      }

      return true;
    });

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
              <h3 className="text-white text-xl font-bold">搜尋結果</h3>
              <p className="text-white">
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
