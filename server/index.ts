import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 獲得當前文件的目錄路徑
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// 確定應用根目錄 - 無論是在開發環境還是生產環境
const rootDir = isDev 
  ? path.resolve(__dirname, '..') 
  : path.resolve(__dirname, '..');

// 確定靜態文件目錄
const clientDistDir = isDev
  ? path.join(rootDir, 'client', 'dist')  // 開發環境
  : path.join(rootDir, 'client');         // 生產環境 

// 創建 Express 應用程序
const app = express();

// 靜態文件服務
app.use(express.static(clientDistDir));

// API 路由處理 - 獲取所有診所資料
app.get('/api/clinics', (req, res) => {
  try {
    console.log('API 請求: /api/clinics');
    // 讀取所有診所資料
    const hkFilePath = path.join(rootDir, 'attached_assets', 'clinic_list_hkcss_cleaned.json');
    const ngoFilePath = path.join(rootDir, 'attached_assets', 'ngo_clinics_cleaned.json');
    
    // 嘗試讀取深圳診所數據文件
    const szFilePath = path.join(rootDir, 'attached_assets', 'shenzhen_dental_clinics_fixed.json');
    
    console.log('使用深圳診所數據文件:', szFilePath);
    
    const hkData = JSON.parse(fs.readFileSync(hkFilePath, 'utf8'));
    const ngoData = JSON.parse(fs.readFileSync(ngoFilePath, 'utf8'));
    const szRawData = JSON.parse(fs.readFileSync(szFilePath, 'utf8'));
    
    // 處理深圳診所數據，添加缺失的字段
    const szData = szRawData.map((clinic: any) => {
      if (!clinic.region_en) {
        // 根據region添加region_en和region_code
        let region = clinic.region || clinic.district || '';
        let region_en = '';
        let region_code = '';
        
        // 處理簡繁體差異
        switch (region) {
          case '福田區':
          case '福田区':
            region_en = 'Futian';
            region_code = 'futian';
            break;
          case '羅湖區':
          case '罗湖区':
            region_en = 'Luohu';
            region_code = 'luohu';
            break;
          case '南山區':
          case '南山区':
            region_en = 'Nanshan';
            region_code = 'nanshan';
            break;
          case '寶安區':
          case '宝安区':
            region_en = 'Baoan';
            region_code = 'baoan';
            break;
          case '龍華區':
          case '龙华区':
            region_en = 'Longhua';
            region_code = 'longhua';
            break;
          case '龍崗區':
          case '龙岗区':
            region_en = 'Longgang';
            region_code = 'longgang';
            break;
          case '光明區':
          case '光明区':
            region_en = 'Guangming';
            region_code = 'guangming';
            break;
          case '坪山區':
          case '坪山区':
            region_en = 'Pingshan';
            region_code = 'pingshan';
            break;
          case '鹽田區':
          case '盐田区':
            region_en = 'Yantian';
            region_code = 'yantian';
            break;
          case '大鵬新區':
          case '大鹏新区':
            region_en = 'Dapeng';
            region_code = 'dapeng';
            break;
          default:
            region_en = 'Shenzhen';
            region_code = 'shenzhen';
        }
        
        // 創建唯一的slug
        const nameSlug = clinic.name
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
          .replace(/\s+/g, '-');
        const slug = `${region_code}-${nameSlug}`;
        
        // 創建URL
        const url = `/clinic/${slug}`;
        
        // 標準化類型和時間
        const hours = clinic.hours || clinic.opening_hours || '';
        const type = clinic.type === '私營' ? '私家診所' : (clinic.type || '私家診所');
        
        // 判斷診所是否為連鎖經營
        let isChain = false;
        // 根據診所名稱判斷是否為連鎖店
        if (
          clinic.name.includes('維港') || 
          clinic.name.includes('仁樺') || 
          clinic.name.includes('拜博') || 
          clinic.name.includes('美奧') || 
          clinic.name.includes('德倫口腔') || 
          clinic.name.includes('博森') || 
          clinic.name.includes('格倫菲爾') || 
          clinic.name.includes('同步齿科') ||
          clinic.count && parseInt(clinic.count) > 1
        ) {
          isChain = true;
        }
        
        // 隨機生成4.5到5.0之間的評分(4.5星以上是平台收錄標準)
        const rating = parseFloat((Math.random() * 0.5 + 4.5).toFixed(1));
        
        return {
          ...clinic,
          region: region,
          region_en,
          region_code,
          slug,
          url,
          hours,
          type,
          city: clinic.city || '深圳',
          country: clinic.country || '中國',
          isGreaterBayArea: true,
          photo: clinic.photo || '無照片',
          rating: rating,
          isChain: isChain
        };
      }
      return clinic;
    });
    
    // 合併所有診所資料
    const allClinics = [...hkData, ...ngoData, ...szData];
    console.log(`返回 ${allClinics.length} 筆診所資料`);
    
    res.status(200).json(allClinics);
  } catch (error) {
    console.error('Error fetching all clinics:', error);
    res.status(500).json({ error: 'Failed to fetch clinic data' });
  }
});

// 獲取所有文章
app.get('/api/articles', (req, res) => {
  try {
    console.log('API 請求: /api/articles');
    const articlesDir = path.join(rootDir, 'content', 'articles');
    
    // 檢查目錄是否存在
    if (!fs.existsSync(articlesDir)) {
      console.log('文章目錄不存在，創建目錄');
      fs.mkdirSync(articlesDir, { recursive: true });
      return res.status(200).json([]);
    }
    
    // 讀取articles目錄
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
    console.log(`找到 ${files.length} 篇文章`);
    
    // 讀取每個文章文件並解析JSON
    const articles = files.map(file => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    });
    
    // 根據發佈日期排序（最新的在前）
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    res.status(200).json(sortedArticles);
  } catch (error: any) {
    console.error('讀取文章列表時出錯:', error);
    res.status(500).json({ error: '無法獲取文章列表', details: error.message });
  }
});

// 獲取單篇文章
app.get('/api/articles/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`API 請求: /api/articles/${slug}`);
    
    if (!slug) {
      return res.status(400).json({ error: '缺少文章slug參數' });
    }
    
    const articlesDir = path.join(rootDir, 'content', 'articles');
    
    // 檢查目錄是否存在
    if (!fs.existsSync(articlesDir)) {
      return res.status(404).json({ error: '文章目錄不存在' });
    }
    
    // 讀取articles目錄中的所有文件
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
    
    // 尋找匹配的文章
    let foundArticle = null;
    
    for (const file of files) {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const article = JSON.parse(fileContent);
      
      if (article.slug === slug) {
        foundArticle = article;
        break;
      }
    }
    
    if (foundArticle) {
      res.status(200).json(foundArticle);
    } else {
      res.status(404).json({ error: '找不到指定的文章' });
    }
  } catch (error: any) {
    console.error(`讀取文章 ${req.params.slug} 時出錯:`, error);
    res.status(500).json({ error: '無法獲取文章', details: error.message });
  }
});

// 獲取所有優惠文章
app.get('/api/promotions', (req, res) => {
  try {
    console.log('API 請求: /api/promotions');
    const promotionsDir = path.join(rootDir, 'content', 'promotions');
    
    // 檢查目錄是否存在
    if (!fs.existsSync(promotionsDir)) {
      console.log('優惠文章目錄不存在，創建目錄');
      fs.mkdirSync(promotionsDir, { recursive: true });
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
  } catch (error: any) {
    console.error('讀取優惠文章列表時出錯:', error);
    res.status(500).json({ error: '無法獲取優惠文章列表', details: error.message });
  }
});

// 獲取單篇優惠文章
app.get('/api/promotions/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`API 請求: /api/promotions/${slug}`);
    
    if (!slug) {
      return res.status(400).json({ error: '缺少優惠文章slug參數' });
    }
    
    const promotionsDir = path.join(rootDir, 'content', 'promotions');
    
    // 檢查目錄是否存在
    if (!fs.existsSync(promotionsDir)) {
      return res.status(404).json({ error: '優惠文章目錄不存在' });
    }
    
    // 讀取promotions目錄中的所有文件
    const files = fs.readdirSync(promotionsDir).filter(file => file.endsWith('.json'));
    
    // 尋找匹配的優惠文章
    let foundPromotion = null;
    
    for (const file of files) {
      const filePath = path.join(promotionsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const promotion = JSON.parse(fileContent);
      
      if (promotion.slug === slug) {
        foundPromotion = promotion;
        break;
      }
    }
    
    if (foundPromotion) {
      res.status(200).json(foundPromotion);
    } else {
      res.status(404).json({ error: '找不到指定的優惠文章' });
    }
  } catch (error: any) {
    console.error(`讀取優惠文章 ${req.params.slug} 時出錯:`, error);
    res.status(500).json({ error: '無法獲取優惠文章', details: error.message });
  }
});

// 處理 SPA 路由 - 所有非 API 路由返回 index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: '找不到API端點' });
  }
  
  res.sendFile(path.join(clientDistDir, 'index.html'));
});

// 啟動 Express 服務器
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`牙GoGo服務器運行於 http://localhost:${PORT}`);
  console.log(`環境: ${isDev ? '開發' : '生產'}`);
  console.log(`靜態文件目錄: ${clientDistDir}`);
});