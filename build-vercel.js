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
if (fs.existsSync(attachedAssetsDir)) {
  // 處理深圳診所數據
  const szFileName = 'shenzhen_dental_clinics_20250407.json';
  const szFilePath = path.join(attachedAssetsDir, szFileName);
  
  if (fs.existsSync(szFilePath)) {
    console.log(`✅ 找到深圳診所數據: ${szFileName}`);
  } else {
    console.log(`⚠️ 找不到深圳診所數據: ${szFileName}`);
  }
  
  // 處理香港診所數據
  const hkFileName = 'clinic_list_hkcss_cleaned.json';
  const hkFilePath = path.join(attachedAssetsDir, hkFileName);
  
  if (fs.existsSync(hkFilePath)) {
    console.log(`✅ 找到香港診所數據: ${hkFileName}`);
  } else {
    console.log(`⚠️ 找不到香港診所數據: ${hkFileName}`);
  }
  
  // 處理NGO診所數據
  const ngoFileName = 'ngo_clinics_cleaned.json';
  const ngoFilePath = path.join(attachedAssetsDir, ngoFileName);
  
  if (fs.existsSync(ngoFilePath)) {
    console.log(`✅ 找到NGO診所數據: ${ngoFileName}`);
  } else {
    console.log(`⚠️ 找不到NGO診所數據: ${ngoFileName}`);
  }
}

// 複製所有內容文件
console.log('📂 複製內容文件...');

// 複製所有文章文件
// 已經在上面定義了 rootContentDir，所以不需要重複定義
const attachedContentDir = path.join(attachedAssetsDir, 'content');

// 嘗試從不同位置複製文章
const possibleSourceLocations = [
  path.join(process.cwd(), 'content'),  // Repo根目錄下的content
  path.join(attachedAssetsDir, 'content'),  // attached_assets/content
  attachedAssetsDir  // 直接使用attached_assets中的JSON檔案
];

// 記錄已複製的文章，避免重複
const copiedArticles = new Set();

// 從內容目錄複製文章
try {
  console.log('正在處理文章...');
  
  // 1. 嘗試從attached_assets中查找特定文章
  const articlePaths = [
    {
      name: "2025年深圳牙科診所的推薦",
      src: path.join(attachedAssetsDir, '2025-shenzhen-dental-clinics-recommendations.json'),
      dest: path.join(articlesDir, '2025-shenzhen-dental-clinics-recommendations.json')
    },
    {
      name: "2025年深圳睇牙性價比分析",
      src: path.join(attachedAssetsDir, '2025-shenzhen-dental-value-analysis.json'),
      dest: path.join(articlesDir, '2025-shenzhen-dental-value-analysis.json')
    }
  ];
  
  // 複製特定已知文章
  for (const article of articlePaths) {
    try {
      if (fs.existsSync(article.src)) {
        fs.copyFileSync(article.src, article.dest);
        console.log(`✅ 已複製文章: ${article.name}`);
        copiedArticles.add(path.basename(article.dest));
      } else {
        console.log(`⚠️ 找不到文章源文件: ${article.src}`);
      }
    } catch (e) {
      console.log(`⚠️ 複製文章失敗: ${article.name}`, e);
    }
  }
  
  // 2. 嘗試從content/articles目錄複製所有文章
  const repoArticlesDir = path.join(process.cwd(), 'content', 'articles');
  if (fs.existsSync(repoArticlesDir)) {
    const articleFiles = fs.readdirSync(repoArticlesDir).filter(f => f.endsWith('.json'));
    console.log(`在原始目錄找到 ${articleFiles.length} 篇文章`);
    
    for (const file of articleFiles) {
      if (!copiedArticles.has(file)) {
        try {
          fs.copyFileSync(path.join(repoArticlesDir, file), path.join(articlesDir, file));
          console.log(`✅ 從原始目錄複製文章: ${file}`);
          copiedArticles.add(file);
        } catch (e) {
          console.log(`⚠️ 複製文章失敗: ${file}`, e);
        }
      }
    }
  } else {
    console.log(`⚠️ 找不到文章原始目錄: ${repoArticlesDir}`);
  }
  
  // 如果沒有文章被複製，創建一個默認文章
  if (copiedArticles.size === 0) {
    console.log('⚠️ 未能複製任何文章，創建默認文章');
    const defaultArticle = {
      title: "2025年深圳睇牙性價比分析：平得嚟值唔值？",
      slug: "2025-shenzhen-dental-value-analysis",
      summary: "深圳洗牙真係又快又平？睇牙醫包矯正仲有套餐？呢篇幫你由價錢、診所質素、潛在風險一次拆解！",
      content: "<h2>1. 深圳洗牙幾錢？</h2>\n<p>根據大眾點評顯示，深圳一般洗牙收費約為 <strong>¥98 ～ ¥198 人民幣</strong>，部分優惠套餐甚至低至 ¥68，換算成港幣大約 HK$75～HK$200。</p>\n<p>比起香港動輒 HK$500 起跳，絕對係「半價甚至更低」。</p>\n\n<h2>2. 整牙 / 箍牙價錢比較</h2>\n<p>透明牙箍（如隱適美）香港私家報價約 HK$30,000～HK$60,000；而深圳正規診所如仁樺口腔、維港口腔等，報價約 ¥15,000～¥25,000（即 HK$16,000～HK$28,000）。</p>\n<p>再加上部分平台仲包定期覆診、拍片記錄，性價比相當吸引。</p>\n\n<h2>3. 有伏位？你要知風險</h2>\n<ul>\n<li>部分「平價診所」可能用低質材料或冇正式牌照</li>\n<li>言語溝通、術後跟進唔及香港貼身</li>\n<li>部分廣告價格未含 X 光、檢查費、加建牙托等</li>\n</ul>\n\n<h2>4. 小貼士：點樣揀診所先穩陣？</h2>\n<ol>\n<li>查清楚診所係咪有 <strong>正規醫療牌照</strong>（可上中國國家衛健委查）</li>\n<li>睇大眾點評 / 美團評分是否超過 4.5 星</li>\n<li>優先揀有連鎖品牌、實體店多嘅診所（如維港、仁樺、拜博）</li>\n</ol>\n\n<p>總結：深圳睇牙係平，但都唔可以「貪平中伏」。搵啱診所，就真係可以慳錢又安心。</p>",
      tags: ["深圳洗牙", "深圳整牙", "深圳睇牙性價比", "深圳睇牙風險"],
      sources: [
        { title: "大眾點評", url: "https://www.dianping.com" }
      ],
      publishedAt: "2025-04-01T12:00:00Z"
    };
    
    // 寫入默認文章
    fs.writeFileSync(path.join(articlesDir, 'default-article.json'), JSON.stringify(defaultArticle, null, 2));
    console.log(`✅ 已創建默認文章`);
  }
  
  console.log(`✅ 總共複製了 ${copiedArticles.size} 篇文章`);
} catch (error) {
  console.error(`❌ 處理文章失敗:`, error);
}

// 優惠文章已移除，不再創建默認優惠文章
console.log('📝 依照用戶要求，不再創建默認優惠文章');

// 構建前端
console.log('🏗️ 開始構建前端...');
try {
  // 直接使用 Vite build 而不是通過 package.json 的 build 腳本
  const clientRoot = path.join(process.cwd(), 'client');
  process.chdir(clientRoot); // 切換到 client 目錄
  execSync('npx vite build', { stdio: 'inherit' });
  process.chdir(process.cwd()); // 切回原目錄
  console.log('✅ 前端構建成功');
} catch (error) {
  console.error('❌ 前端構建失敗:', error);
  process.exit(1);
}

// 確保public目錄下有favicons等靜態資源
console.log('📂 處理靜態資源...');
const publicDir = path.join(process.cwd(), 'public');
const clientDistDir = path.join(process.cwd(), 'client', 'dist');
const assetsDir = path.join(process.cwd(), 'attached_assets');

// 確保favicon複製到構建目錄
const faviconPath = path.join(assetsDir, 'favicon.ico');
const faviconDestPath = path.join(clientDistDir, 'favicon.ico');

if (fs.existsSync(faviconPath) && !fs.existsSync(faviconDestPath)) {
  try {
    // 拷貝favicon
    fs.copyFileSync(faviconPath, faviconDestPath);
    console.log(`✅ 已複製favicon.ico到構建目錄`);
  } catch (error) {
    console.error(`❌ 複製favicon失敗:`, error);
  }
}

// 確保og-image複製到構建目錄的images子目錄
const ogImagePath = path.join(assetsDir, 'og-image.png');
const imagesDir = path.join(clientDistDir, 'images');
const ogImageDestPath = path.join(imagesDir, 'og-image.png');

if (fs.existsSync(ogImagePath)) {
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  try {
    // 拷貝og-image
    fs.copyFileSync(ogImagePath, ogImageDestPath);
    console.log(`✅ 已複製og-image.png到構建目錄`);
  } catch (error) {
    console.error(`❌ 複製og-image失敗:`, error);
  }
}

// 確保Google驗證文件存在
const googleVerificationPath = path.join(assetsDir, 'googlee2ca71ad5059f9c9.html');
const googleVerificationDestPath = path.join(clientDistDir, 'googlee2ca71ad5059f9c9.html');

if (fs.existsSync(googleVerificationPath)) {
  try {
    // 拷貝Google驗證文件
    fs.copyFileSync(googleVerificationPath, googleVerificationDestPath);
    console.log(`✅ 已複製Google驗證文件到構建目錄`);
  } catch (error) {
    console.error(`❌ 複製Google驗證文件失敗:`, error);
  }
}

// 確保sitemap.xml存在
const sitemapPath = path.join(assetsDir, 'sitemap.xml');
const sitemapDestPath = path.join(clientDistDir, 'sitemap.xml');

if (fs.existsSync(sitemapPath)) {
  try {
    // 拷貝sitemap.xml
    fs.copyFileSync(sitemapPath, sitemapDestPath);
    console.log(`✅ 已複製sitemap.xml到構建目錄`);
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