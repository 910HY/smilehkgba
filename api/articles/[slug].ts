import fs from 'fs';
import path from 'path';

/**
 * 獲取單篇文章的API端點
 */
export default function handler(req: any, res: any) {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: '缺少文章標識符' });
    }
    
    const contentDir = path.join(process.cwd(), 'content', 'articles');
    const filePath = path.join(contentDir, `${slug}.json`);
    
    // 檢查文章是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '找不到該文章' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const article = JSON.parse(fileContent);
    
    return res.status(200).json(article);
  } catch (error) {
    console.error(`獲取文章時出錯: ${req.params.slug}`, error);
    return res.status(500).json({ error: '服務器錯誤' });
  }
}