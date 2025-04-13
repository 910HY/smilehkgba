// 專門為Vercel部署環境準備的構建腳本
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 獲取當前文件的目錄路徑
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 開始Vercel構建流程...');

// 確保content目錄和子目錄都存在
console.log('📂 確保內容目錄結構存在...');
const rootContentDir = path.join(process.cwd(), 'content');
const articlesDir = path.join(rootContentDir, 'articles');
const promotionsDir = path.join(rootContentDir, 'promotions');

// 建立內容目錄結構
[rootContentDir, articlesDir, promotionsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 已創建 ${dir} 目錄`);
  }
});

// 處理診所數據文件
console.log('📂 處理診所數據文件...');
const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
const publicApiDir = path.join(process.cwd(), 'public', 'api');
const apiDataDir = path.join(publicApiDir, 'data');

// 確保API數據目錄存在 - 為Vercel部署創建必要的目錄
[publicApiDir, apiDataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 已創建API目錄: ${dir}`);
  }
});

// 獲取Vercel輸出目錄 - 用於確保最終構建產物也包含數據
const vercelOutputDir = path.join(process.cwd(), '.vercel', 'output', 'static', 'api', 'data');
const vercelApiDirExists = fs.existsSync(path.dirname(vercelOutputDir));

if (vercelApiDirExists) {
  if (!fs.existsSync(vercelOutputDir)) {
    fs.mkdirSync(vercelOutputDir, { recursive: true });
    console.log(`✅ 已創建Vercel輸出API數據目錄: ${vercelOutputDir}`);
  }
}

// 定義所有需要向其複製數據文件的路徑
const allApiDataDirs = [
  apiDataDir,                   // /public/api/data
  vercelApiDirExists ? vercelOutputDir : null  // /.vercel/output/static/api/data (如果存在)
].filter(Boolean);

// 統一數據複製函數 - 複製到所有目標目錄
function copyToAllApiDirs(srcPath, targetFileName, description) {
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️ 找不到源文件: ${srcPath}`);
    return false;
  }
  
  let anySuccess = false;
  
  for (const dir of allApiDataDirs) {
    try {
      const destPath = path.join(dir, targetFileName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 已複製${description}到 ${dir}`);
      anySuccess = true;
    } catch (e) {
      console.log(`⚠️ 複製${description}到 ${dir} 失敗:`, e);
    }
  }
  
  return anySuccess;
}

if (fs.existsSync(attachedAssetsDir)) {
  // 處理深圳診所數據 - 依照優先順序複製
  const szFileNames = [
    'enhanced_sz_clinics.json',  // 優先使用增強版
    'fixed_sz_clinics.json',     // 備選使用修復版
    'shenzhen_dental_clinics_fixed.json',  // 備選使用修復版 (另一名稱)
    'shenzhen_dental_clinics_valid.json',  // 備選使用有效版
    'shenzhen_dental_clinics_20250407.json'  // 最後使用原始版
  ];
  
  // 嘗試複製每個文件直到成功
  let szFileCopied = false;
  for (const fileName of szFileNames) {
    const srcPath = path.join(attachedAssetsDir, fileName);
    
    if (fs.existsSync(srcPath) && !szFileCopied) {
      // 以統一名稱保存，確保API始終查找相同文件名
      szFileCopied = copyToAllApiDirs(
        srcPath, 
        'enhanced_sz_clinics.json', 
        `深圳診所數據(${fileName})`
      );
      
      // 為安全起見，同時複製原始名稱的文件
      copyToAllApiDirs(srcPath, fileName, `原始深圳診所數據(${fileName})`);
    }
  }
  
  if (!szFileCopied) {
    console.log(`⚠️ 未能找到任何可用的深圳診所數據文件`);
  }
  
  // 處理香港診所數據
  const hkFileName = 'clinic_list_hkcss_cleaned.json';
  const hkSrcPath = path.join(attachedAssetsDir, hkFileName);
  copyToAllApiDirs(hkSrcPath, hkFileName, '香港診所數據');
  
  // 處理NGO診所數據
  const ngoFileName = 'ngo_clinics_cleaned.json';
  const ngoSrcPath = path.join(attachedAssetsDir, ngoFileName);
  copyToAllApiDirs(ngoSrcPath, ngoFileName, 'NGO診所數據');
  
  // 添加直接複製整個attached_assets目錄到public下，確保所有數據都可用
  const publicAssetsDir = path.join(process.cwd(), 'public', 'attached_assets');
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true });
  }
  
  // 複製attached_assets目錄下的所有json文件到public/attached_assets
  console.log('📦 複製所有JSON數據文件到public目錄...');
  const jsonFiles = fs.readdirSync(attachedAssetsDir).filter(file => file.endsWith('.json'));
  
  for (const file of jsonFiles) {
    try {
      fs.copyFileSync(
        path.join(attachedAssetsDir, file),
        path.join(publicAssetsDir, file)
      );
      console.log(`✅ 已複製 ${file} 到 public/attached_assets`);
    } catch (e) {
      console.log(`⚠️ 複製 ${file} 失敗:`, e);
    }
  }
}

// 複製所有內容文件
console.log('📂 複製內容文件...');

// 確保內容目錄結構存在
const publicContentDir = path.join(process.cwd(), 'public', 'content');
const publicArticlesDir = path.join(publicContentDir, 'articles');
const publicPromotionsDir = path.join(publicContentDir, 'promotions');

// 確保所有必需的目錄存在
[
  publicContentDir,
  publicArticlesDir,
  publicPromotionsDir
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 已創建目錄: ${dir}`);
  }
});

// 獲取Vercel輸出內容目錄
const vercelContentDir = path.join(process.cwd(), '.vercel', 'output', 'static', 'content');
const vercelArticlesDir = path.join(vercelContentDir, 'articles');
const vercelDirExists = fs.existsSync(path.dirname(vercelContentDir));

if (vercelDirExists) {
  if (!fs.existsSync(vercelContentDir)) {
    fs.mkdirSync(vercelContentDir, { recursive: true });
  }
  if (!fs.existsSync(vercelArticlesDir)) {
    fs.mkdirSync(vercelArticlesDir, { recursive: true });
  }
  console.log(`✅ 已創建Vercel輸出內容目錄`);
}

// 所有需要複製文章的目標目錄
const allArticlesDirs = [
  articlesDir,                    // /content/articles (主要目錄)
  publicArticlesDir,              // /public/content/articles
  vercelDirExists ? vercelArticlesDir : null  // /.vercel/output/static/content/articles
].filter(Boolean);

// 複製文章到所有目標目錄的通用函數
function copyArticleToAllDirs(srcPath, fileName, articleTitle) {
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️ 找不到文章源文件: ${srcPath}`);
    return false;
  }
  
  let anySuccess = false;
  
  for (const dir of allArticlesDirs) {
    try {
      const destPath = path.join(dir, fileName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 已複製文章「${articleTitle}」到 ${dir}`);
      anySuccess = true;
    } catch (e) {
      console.log(`⚠️ 複製文章「${articleTitle}」到 ${dir} 失敗:`, e);
    }
  }
  
  return anySuccess;
}

// 記錄已複製的文章，避免重複
const copiedArticles = new Set();

// 從內容目錄複製文章
try {
  console.log('正在處理文章...');
  
  // 1. 首先嘗試從attached_assets中查找特定文章
  const knownArticles = [
    {
      name: "2025年深圳牙科診所的推薦",
      fileName: "2025-shenzhen-dental-clinics-recommendations.json",
      possibleLocations: [
        path.join(attachedAssetsDir, '2025-shenzhen-dental-clinics-recommendations.json')
      ]
    },
    {
      name: "2025年深圳睇牙性價比分析",
      fileName: "2025-shenzhen-dental-value-analysis.json",
      possibleLocations: [
        path.join(attachedAssetsDir, '2025-shenzhen-dental-value-analysis.json'),
        path.join(attachedAssetsDir, '2025-shenzhen-dental-value.json')
      ]
    }
  ];
  
  // 嘗試複製已知的特定文章
  for (const article of knownArticles) {
    let articleCopied = false;
    
    // 嘗試所有可能的位置
    for (const srcPath of article.possibleLocations) {
      if (fs.existsSync(srcPath) && !articleCopied) {
        articleCopied = copyArticleToAllDirs(srcPath, article.fileName, article.name);
        if (articleCopied) {
          copiedArticles.add(article.fileName);
          break;
        }
      }
    }
    
    if (!articleCopied) {
      console.log(`⚠️ 未能找到文章「${article.name}」的任何源文件`);
    }
  }
  
  // 2. 嘗試從content/articles目錄複製所有文章
  const repoDirs = [
    path.join(process.cwd(), 'content', 'articles'),
    path.join(attachedAssetsDir, 'content', 'articles')
  ];
  
  for (const repoDir of repoDirs) {
    if (fs.existsSync(repoDir)) {
      const articleFiles = fs.readdirSync(repoDir).filter(f => f.endsWith('.json'));
      console.log(`在 ${repoDir} 找到 ${articleFiles.length} 篇文章`);
      
      for (const file of articleFiles) {
        if (!copiedArticles.has(file)) {
          const filePath = path.join(repoDir, file);
          if (copyArticleToAllDirs(filePath, file, `文件 ${file}`)) {
            copiedArticles.add(file);
          }
        }
      }
    }
  }
  
  // 3. 嘗試直接從attachedAssets目錄查找可能的文章文件
  const potentialArticleFiles = fs.readdirSync(attachedAssetsDir)
    .filter(f => f.endsWith('.json') && !f.includes('clinic') && !f.includes('dental'));
  
  for (const file of potentialArticleFiles) {
    if (!copiedArticles.has(file)) {
      const filePath = path.join(attachedAssetsDir, file);
      try {
        // 嘗試讀取文件內容，判斷是否為文章
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        // 檢查是否包含文章必需字段
        if (data.title && data.content && (data.slug || file.replace('.json', ''))) {
          // 這是文章文件，複製到所有目標目錄
          if (copyArticleToAllDirs(filePath, file, data.title)) {
            copiedArticles.add(file);
          }
        }
      } catch (e) {
        // 讀取或解析錯誤，跳過此文件
        console.log(`⚠️ 檢查可能的文章文件失敗: ${file}`, e.message);
      }
    }
  }
  
  // 如果沒有文章被複製，創建一些默認文章
  if (copiedArticles.size === 0) {
    console.log('⚠️ 未能複製任何文章，創建默認文章');
    
    // 2025年深圳牙科診所的推薦
    const article1 = {
      title: "2025年深圳牙科診所的推薦",
      slug: "2025-shenzhen-dental-clinics-recommendations",
      summary: "精選5間2025年深圳口碑最好牙科診所，全部評分4.5分以上，靠近香港口岸，附WhatsApp預約方法！",
      content: "以下是2025年深圳牙科診所的推薦，這些診所均符合大眾評分4.5分以上、連鎖經營、有真人分享評價，並且交通便利（靠近香港關口），同時附上香港預約方法：\n\n<h2>1. 自有光口腔診所（深圳佳寧娜廣場店）</h2>\n<p><strong>評分：4.7/5（Google & 大眾點評）</strong></p>\n\n<p><strong>特色：</strong>香港品牌，由香港牙醫團隊管理，提供洗牙、植牙、美白等服務。</p>",
      tags: ["深圳牙科診所推薦", "深圳口腔醫院", "深圳植牙", "深圳洗牙", "香港人北上睇牙"],
      sources: [{ title: "大眾點評", url: "https://www.dianping.com" }],
      publishedAt: "2025-04-07T00:00:00Z"
    };
    
    // 2025年深圳睇牙性價比分析
    const article2 = {
      title: "2025年深圳睇牙性價比分析：平得嚟值唔值？",
      slug: "2025-shenzhen-dental-value-analysis",
      summary: "深圳洗牙真係又快又平？睇牙醫包矯正仲有套餐？呢篇幫你由價錢、診所質素、潛在風險一次拆解！",
      content: "<h2>1. 深圳洗牙幾錢？</h2>\n<p>根據大眾點評顯示，深圳一般洗牙收費約為 <strong>¥98 ～ ¥198 人民幣</strong>，部分優惠套餐甚至低至 ¥68，換算成港幣大約 HK$75～HK$200。</p>\n<p>比起香港動輒 HK$500 起跳，絕對係「半價甚至更低」。</p>",
      tags: ["深圳洗牙", "深圳整牙", "深圳睇牙性價比", "深圳睇牙風險"],
      sources: [{ title: "大眾點評", url: "https://www.dianping.com" }],
      publishedAt: "2025-04-01T12:00:00Z"
    };
    
    const defaultArticles = [
      { data: article1, fileName: 'shenzhen-dental-clinics-recommendations.json' },
      { data: article2, fileName: 'shenzhen-dental-value-analysis.json' }
    ];
    
    // 寫入默認文章到所有目標目錄
    for (const article of defaultArticles) {
      const articleJson = JSON.stringify(article.data, null, 2);
      
      for (const dir of allArticlesDirs) {
        try {
          fs.writeFileSync(path.join(dir, article.fileName), articleJson);
          console.log(`✅ 已在 ${dir} 創建默認文章: ${article.data.title}`);
          copiedArticles.add(article.fileName);
        } catch (e) {
          console.log(`⚠️ 創建默認文章失敗: ${article.data.title} 在 ${dir}`, e);
        }
      }
    }
  }
  
  console.log(`✅ 總共複製/創建了 ${copiedArticles.size} 篇文章`);
} catch (error) {
  console.error(`❌ 處理文章失敗:`, error);
}

// 優惠文章已移除，不再創建默認優惠文章
console.log('📝 依照用戶要求，不再創建默認優惠文章');

// 構建前端
console.log('🏗️ 開始構建前端...');
try {
  // 使用 Next.js 構建
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js 構建成功');
} catch (error) {
  console.error('❌ Next.js 構建失敗:', error);
  process.exit(1);
}

// 確保public目錄下有favicons等靜態資源
console.log('📂 處理靜態資源...');
const publicDir = path.join(process.cwd(), 'public');
const assetsDir = path.join(process.cwd(), 'attached_assets');

// 確保favicon複製到public目錄
const faviconPath = path.join(assetsDir, 'favicon.ico');
const faviconDestPath = path.join(publicDir, 'favicon.ico');

if (fs.existsSync(faviconPath) && !fs.existsSync(faviconDestPath)) {
  try {
    // 拷貝favicon
    fs.copyFileSync(faviconPath, faviconDestPath);
    console.log(`✅ 已複製favicon.ico到public目錄`);
  } catch (error) {
    console.error(`❌ 複製favicon失敗:`, error);
  }
}

// 確保og-image複製到public/images目錄
const ogImagePath = path.join(assetsDir, 'og-image.png');
const imagesDir = path.join(publicDir, 'images');
const ogImageDestPath = path.join(imagesDir, 'og-image.png');

if (fs.existsSync(ogImagePath)) {
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  try {
    // 拷貝og-image
    fs.copyFileSync(ogImagePath, ogImageDestPath);
    console.log(`✅ 已複製og-image.png到public/images目錄`);
  } catch (error) {
    console.error(`❌ 複製og-image失敗:`, error);
  }
}

// 確保Google驗證文件存在於public目錄
const googleVerificationPath = path.join(assetsDir, 'googlee2ca71ad5059f9c9.html');
const googleVerificationDestPath = path.join(publicDir, 'googlee2ca71ad5059f9c9.html');

if (fs.existsSync(googleVerificationPath)) {
  try {
    // 拷貝Google驗證文件
    fs.copyFileSync(googleVerificationPath, googleVerificationDestPath);
    console.log(`✅ 已複製Google驗證文件到public目錄`);
  } catch (error) {
    console.error(`❌ 複製Google驗證文件失敗:`, error);
  }
}

// 確保sitemap.xml存在於public目錄
const sitemapPath = path.join(assetsDir, 'sitemap.xml');
const sitemapDestPath = path.join(publicDir, 'sitemap.xml');

if (fs.existsSync(sitemapPath)) {
  try {
    // 拷貝sitemap.xml
    fs.copyFileSync(sitemapPath, sitemapDestPath);
    console.log(`✅ 已複製sitemap.xml到public目錄`);
  } catch (error) {
    console.error(`❌ 複製sitemap.xml失敗:`, error);
  }
}

// 確保API目錄被複製到構建目錄
console.log('🏗️ 配置Serverless API...');
try {
  console.log('✅ 使用Vercel API Routes，不需要單獨構建');
} catch (error) {
  console.error('❌ API配置失敗:', error);
  process.exit(1);
}

console.log('🎉 Vercel構建流程完成!');