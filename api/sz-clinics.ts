import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  // 添加 CORS 頭，允許從任何源訪問
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 處理 OPTIONS 請求
  if (_req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const filePath = path.join(process.cwd(), 'api', 'data', 'shenzhen_dental_clinics_20250407.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const clinics = JSON.parse(data);
    res.status(200).json(clinics);
  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({ error: 'Failed to read Shenzhen clinic data', message: (error as Error).message });
  }
}
