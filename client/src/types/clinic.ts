export interface Clinic {
  id?: string;
  name: string;
  name_en?: string;
  address: string;
  address_en?: string;
  region?: string;
  district?: string;
  count?: string | number;
  type?: string;
  phone?: string | number;
  hours?: string;
  opening_hours?: string;
  photo?: string;
  city?: string;
  country?: string;
  isGreaterBayArea?: boolean;
  sourceLink?: string;
  website?: string;
  description?: string;
  services?: string[];
  languages?: string[];
  price_range?: string;
  source?: 'hk' | 'ngo' | 'sz';
  location?: {
    lat: number;
    lng: number;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  prices?: {
    洗牙?: string;
    補牙?: string;
    拔牙?: string;
    植牙?: string;
    [key: string]: string | undefined;
  };
}
