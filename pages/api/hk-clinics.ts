import { rootDir, handleApiResponse, handleApiError, readJsonFile } from './_utils';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/hk-clinics');
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const filePath = path.join(rootDir, 'public', 'data', 'clinic_list_hkcss_cleaned.json');
    const data = readJsonFile(filePath);
    console.log(`返回 ${data.length} 筆香港診所資料`);
    return handleApiResponse(res, data);
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch HK clinic data');
  }
}