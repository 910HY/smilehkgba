import fs from 'fs';
import path from 'path';

/**
 * 獲取所有文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'articles');
    
    // 確保目錄存在
    if (!fs.existsSync(contentDir)) {
      console.error('文章目錄不存在:', contentDir);
      return res.status(404).json({ error: '找不到文章' });
    }
    
    const files = fs.readdirSync(contentDir);
    const articles = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        try {
          return JSON.parse(fileContent);
        } catch (error) {
          console.error(`解析文章時出錯: ${file}`, error);
          return null;
        }
      })
      .filter(article => article !== null);
    
    // 根據發佈日期排序（最新的在前）
    articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return res.status(200).json(articles);
  } catch (error) {
    console.error('獲取文章時出錯:', error);
    return res.status(500).json({ error: '服務器錯誤' });
  }
}