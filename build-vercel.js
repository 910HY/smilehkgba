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
const contentDir = path.join(process.cwd(), 'content');
const articlesDir = path.join(contentDir, 'articles');
const promotionsDir = path.join(contentDir, 'promotions');

// 建立內容目錄結構
[contentDir, articlesDir, promotionsDir].forEach(dir => {
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

// 確保文章內容存在
const articleSourceFile = path.join(attachedAssetsDir, '2025-shenzhen-dental-value-analysis.json');
const articleDestFile = path.join(articlesDir, '2025-shenzhen-dental-value-analysis.json');

if (fs.existsSync(articleSourceFile) && !fs.existsSync(articleDestFile)) {
  try {
    // 讀取文章數據
    const articleData = JSON.parse(fs.readFileSync(articleSourceFile, 'utf8'));
    
    // 確保有正確的文章格式
    const formattedArticle = {
      title: articleData.title || "2025年深圳睇牙性價比分析：平得嚟值唔值？",
      slug: "2025-shenzhen-dental-value-analysis",
      summary: articleData.summary || "深圳洗牙真係又快又平？睇牙醫包矯正仲有套餐？呢篇幫你由價錢、診所質素、潛在風險一次拆解！",
      content: articleData.content || "",
      tags: articleData.tags || ["深圳洗牙", "深圳整牙", "深圳睇牙性價比", "深圳睇牙風險"],
      sources: articleData.sources || [
        { title: "大眾點評", url: "https://www.dianping.com" }
      ],
      publishedAt: articleData.publishedAt || "2025-04-01T12:00:00Z"
    };
    
    // 寫入格式化後的文章
    fs.writeFileSync(articleDestFile, JSON.stringify(formattedArticle, null, 2));
    console.log(`✅ 已創建文章: ${articleDestFile}`);
  } catch (error) {
    console.error(`❌ 創建文章失敗:`, error);
  }
}

// 確保優惠文章內容存在
const promotionDestFile = path.join(promotionsDir, 'hongkong-dental-month-2025.json');

if (!fs.existsSync(promotionDestFile)) {
  try {
    // 創建示例優惠文章
    const promotionExample = {
      title: "2025港島洗牙月優惠：4大連鎖牙科診所比較",
      slug: "hongkong-dental-month-2025",
      summary: "港島區4大連鎖牙科診所「2025洗牙月」活動優惠大比拼！讓你一次看清邊間最抵！",
      content: "<h2>4大連鎖牙科診所洗牙優惠</h2>\n<p>今年4-5月，港島區多間知名連鎖牙科診所推出「洗牙月」優惠，最低價低至$350起！</p>\n\n<h3>1. 恆健牙科</h3>\n<ul>\n<li>洗牙價格: <strong>$350</strong> (原價$480)</li>\n<li>限時: 4月1日至5月15日</li>\n<li>適用分店: 中環、銅鑼灣、太古分店</li>\n<li>備註: 需網上預約，首次預約免治療諮詢費</li>\n</ul>\n\n<h3>2. 德善牙醫</h3>\n<ul>\n<li>洗牙價格: <strong>$380</strong> (原價$550)</li>\n<li>限時: 4月全月</li>\n<li>適用分店: 灣仔、中環分店</li>\n<li>備註: 附送口腔檢查及醫生報告</li>\n</ul>\n\n<h3>3. 庇利牙科</h3>\n<ul>\n<li>洗牙價格: <strong>$420</strong> (原價$650)</li>\n<li>限時: 4月1日至5月31日</li>\n<li>適用分店: 金鐘、銅鑼灣分店</li>\n<li>備註: 同時預約補牙可享補牙85折</li>\n</ul>\n\n<h3>4. 樂德牙醫</h3>\n<ul>\n<li>洗牙價格: <strong>$450</strong> (原價$580)</li>\n<li>限時: 4月15日至5月15日</li>\n<li>適用分店: 中環分店</li>\n<li>備註: 附送數碼全口X光片一次</li>\n</ul>\n\n<h2>邊間最抵？</h2>\n<p>純以價格來說，恆健牙科$350最實惠。但若考慮額外服務，樂德牙醫送全口X光片價值超過$300，適合想全面檢查的人士。</p>\n\n<p><strong>小貼士：</strong>4-5月是牙科診所傳統淡季，因此推廣特別多。建議致電個別診所查詢最新詳情，部分診所更可能有額外優惠！</p>",
      tags: ["洗牙優惠", "牙科診所", "港島區", "口腔健康", "洗牙價格"],
      sources: [
        { title: "恆健牙科", url: "https://www.example.com/hk-dental" },
        { title: "德善牙醫", url: "https://www.example.com/virtuous-dental" }
      ],
      publishedAt: "2025-04-05T09:30:00Z"
    };
    
    // 寫入優惠文章
    fs.writeFileSync(promotionDestFile, JSON.stringify(promotionExample, null, 2));
    console.log(`✅ 已創建優惠文章: ${promotionDestFile}`);
  } catch (error) {
    console.error(`❌ 創建優惠文章失敗:`, error);
  }
}

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

// 構建後端
console.log('🏗️ 開始構建後端...');
try {
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  console.log('✅ 後端構建成功');
} catch (error) {
  console.error('❌ 後端構建失敗:', error);
  process.exit(1);
}

console.log('🎉 Vercel構建流程完成!');