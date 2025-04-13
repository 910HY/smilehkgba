import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from './_utils';
import path from 'path';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 獲取所有優惠文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API 請求: /api/promotions');
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // 在不同位置查找優惠文章目錄
    const possiblePromotionsPaths = [
      // public/promotions (優先位置) - 推薦的直接公開路徑
      path.join(rootDir, 'public', 'promotions'),
      // content/promotions (備用位置)
      path.join(rootDir, 'content', 'promotions'),
      // Vercel部署可能的位置
      path.join(process.cwd(), 'public', 'promotions'),
      // attached_assets下查找
      path.join(rootDir, 'attached_assets'),
    ];
    
    // 找到存在的優惠文章目錄
    let promotionsDir = '';
    
    for (const dirPath of possiblePromotionsPaths) {
      if (fs.existsSync(dirPath)) {
        promotionsDir = dirPath;
        console.log(`找到優惠文章目錄: ${dirPath}`);
        break;
      }
    }
    
    // 如果沒有找到任何優惠文章目錄，返回空數組
    if (promotionsDir === '') {
      console.log('找不到任何優惠文章目錄');
      return handleApiResponse(res, []);
    }
    
    // 讀取優惠文章目錄
    const files = fs.readdirSync(promotionsDir)
      .filter(file => file.endsWith('.json') && !file.includes('clinic'));
    console.log(`找到 ${files.length} 篇優惠文章`);
    
    // 讀取每個優惠文章文件並解析JSON
    const promotions = files.map(file => {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      try {
        const promotion = JSON.parse(fileContent);
        // 確保優惠文章有所有必要的字段
        if (!promotion.title || !promotion.slug) {
          console.warn(`優惠文章 ${file} 缺少必要字段`);
          return null;
        }
        return promotion;
      } catch (e) {
        console.error(`文件解析失敗: ${file}`, e);
        return null;
      }
    }).filter(promotion => promotion !== null) as any[]; // 移除解析失敗或缺少字段的文件
    
    // 根據發佈日期排序（最新的在前）
    const sortedPromotions = promotions.sort((a, b) => 
      new Date(b.publishedAt || '2024-01-01').getTime() - new Date(a.publishedAt || '2024-01-01').getTime()
    );
    
    return handleApiResponse(res, sortedPromotions);
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取優惠文章列表');
  }
}