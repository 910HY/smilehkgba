import { Clinic } from "../types/clinic";

// Function to fetch and merge clinic data from JSON files
export async function fetchClinicData(): Promise<Clinic[]> {
  try {
    const [hkClinicsResp, ngoClinicsResp, szClinicsResp] = await Promise.all([
      fetch('/api/hk-clinics'),
      fetch('/api/ngo-clinics'),
      fetch('/api/sz-clinics')
    ]);

    // For demonstration purposes, we're handling 404s by providing empty arrays
    // In production, you would want better error handling here
    const hkClinics = hkClinicsResp.ok ? await hkClinicsResp.json() : [];
    const ngoClinics = ngoClinicsResp.ok ? await ngoClinicsResp.json() : [];
    const szClinics = szClinicsResp.ok ? await szClinicsResp.json() : [];

    // Merge all clinics
    return [...hkClinics, ...ngoClinics, ...szClinics];
  } catch (error) {
    console.error("Error fetching clinic data:", error);
    return [];
  }
}

// This is a fallback/mock data approach that would load directly from assets
// only used if API endpoints aren't available
export const fetchClinicDataFallback = async (): Promise<Clinic[]> => {
  const mergeDataFromJsonFiles = () => {
    // We would load the JSON files directly from assets
    // In a real implementation, this would use the attached assets
    // However, this would only be used as a fallback if API endpoints failed
    
    // For now, returning a small sample just to prevent complete failure
    return [];
  };
  
  return mergeDataFromJsonFiles();
};
