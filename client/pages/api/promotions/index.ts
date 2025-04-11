import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 獲取項目根目錄
const rootDir = process.env.VERCEL ? process.cwd() : path.resolve(__dirname, '../../../../');

// 工具函數：獲取文件路徑
function getFilePath(...pathSegments: string[]): string {
  return path.join(rootDir, ...pathSegments);
}

// 工具函數：確保目錄存在
function ensureDirectoryExists(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return false;
  }
  return true;
}

/**
 * 獲取所有優惠文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/promotions');
    const promotionsDir = getFilePath('content', 'promotions');
    
    // 檢查目錄是否存在
    if (!ensureDirectoryExists(promotionsDir)) {
      console.log('優惠文章目錄不存在，已創建目錄');
      return res.status(200).json([]);
    }
    
    // 讀取promotions目錄
    const files = fs.readdirSync(promotionsDir).filter(file => file.endsWith('.json'));
    console.log(`找到 ${files.length} 篇優惠文章`);
    
    // 讀取每個優惠文章文件並解析JSON
    const promotions = files.map(file => {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    });
    
    // 根據發佈日期排序（最新的在前）
    const sortedPromotions = promotions.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    res.status(200).json(sortedPromotions);
  } catch (error) {
    console.error('讀取優惠文章列表時出錯:', error);
    res.status(500).json({ error: '無法獲取優惠文章列表', details: (error as Error).message });
  }
}