import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 添加 CORS 頭，允許從任何源訪問
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    console.log('當前工作目錄:', process.cwd());
    const base = path.join(process.cwd(), 'api', 'data');
    console.log('數據文件路徑:', base);
    
    // 列出目錄內容以進行調試
    console.log('api/data 目錄內容:', fs.readdirSync(base));
    
    const hk = JSON.parse(fs.readFileSync(path.join(base, 'clinic_list_hkcss_cleaned.json'), 'utf8'));
    const ngo = JSON.parse(fs.readFileSync(path.join(base, 'ngo_clinics_cleaned.json'), 'utf8'));
    const sz = JSON.parse(fs.readFileSync(path.join(base, 'shenzhen_dental_clinics_20250407.json'), 'utf8'));

    res.status(200).json([...hk, ...ngo, ...sz]);
  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({ error: 'Failed to read clinic data', message: (error as Error).message });
  }
}
