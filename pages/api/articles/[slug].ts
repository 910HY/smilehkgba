import { rootDir, handleApiResponse, handleApiError, ensureDirectoryExists } from '../_utils';
import path from 'path';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 獲取單篇文章的API端點
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;
    console.log(`API 請求: /api/articles/${slug}`);
    
    // 設置響應頭，防止 Vercel 緩存
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ error: '缺少文章slug參數或格式錯誤' });
    }
    
    // 在不同位置查找文章目錄
    const possibleArticlesPaths = [
      // public/articles (優先位置) - 推薦的直接公開路徑
      path.join(rootDir, 'public', 'articles'),
      // client/content/articles (次要位置)
      path.join(rootDir, 'client', 'content', 'articles'),
      // content/articles (備用位置)
      path.join(rootDir, 'content', 'articles'),
      // Vercel部署可能的位置
      path.join(process.cwd(), 'public', 'articles'),
      // attached_assets下查找
      path.join(rootDir, 'attached_assets'),
    ];
    
    // 尋找匹配的文章
    let foundArticle = null;
    
    // 紀錄請求的slug和類型
    console.log(`尋找文章slug: "${slug}",類型: ${typeof slug}`);
    
    // 遍歷所有可能的目錄
    for (const articlesDir of possibleArticlesPaths) {
      // 如果目錄存在
      if (fs.existsSync(articlesDir)) {
        console.log(`檢查目錄: ${articlesDir}`);
        
        // 讀取目錄中的所有文件
        // 過濾JSON文件，但排除特定的診所數據文件
        const excludePatterns = [
          'shenzhen_dental_clinics_',
          'fixed_',
          '_fixed',
          'clinic_list_',
          'ngo_clinics_',
          'enhanced_sz_clinics'
        ];
        
        const allFiles = fs.readdirSync(articlesDir);
        console.log(`目錄 ${articlesDir} 中的所有文件:`, allFiles);
        
        const files = allFiles.filter(file => {
          // 必須是JSON文件
          if (!file.endsWith('.json')) return false;
          
          // 檢查是否包含任何排除模式
          for (const pattern of excludePatterns) {
            if (file.includes(pattern)) return false;
          }
          
          // 特別包含包含"recommendations"的文件，即使包含"clinics"
          if (file.includes('recommendations')) return true;
          
          return true;
        });
        
        console.log(`過濾後的文件列表:`, files);
        
        // 查找匹配的文章
        for (const file of files) {
          const filePath = path.join(articlesDir, file);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const article = JSON.parse(fileContent);
            
            console.log(`檢查文件 ${file}, 其slug為 "${article.slug}"`);
            
            if (article.slug === slug) {
              foundArticle = article;
              console.log(`找到匹配的文章: ${file}`);
              break;
            }
          } catch (e) {
            console.error(`解析文件失敗: ${file}`, e);
          }
        }
        
        // 如果找到了文章，退出循環
        if (foundArticle) {
          break;
        }
      }
    }
    
    if (foundArticle) {
      return handleApiResponse(res, foundArticle);
    } else {
      // 提供更詳細的錯誤信息
      return res.status(404).json({ 
        error: `找不到指定的文章（slug: ${slug}）`,
        searchedLocations: possibleArticlesPaths.filter(dir => fs.existsSync(dir))
      });
    }
  } catch (error: any) {
    return handleApiError(res, error, '無法獲取文章');
  }
}