import { rootDir, handleApiResponse, handleApiError, readJsonFile } from './_utils';
import path from 'path';

export default function handler(req: any, res: any) {
  try {
    console.log('API 請求: /api/hk-clinics');
    const filePath = path.join(rootDir, 'attached_assets', 'clinic_list_hkcss_cleaned.json');
    const data = readJsonFile(filePath);
    console.log(`返回 ${data.length} 筆香港診所資料`);
    return handleApiResponse(res, data);
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch HK clinic data');
  }
}