// 專門為Vercel部署環境準備的構建腳本
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 開始Vercel構建流程...');

// 確保API目錄中有數據文件
console.log('📂 確保API數據文件存在...');
const apiDataDir = path.join(process.cwd(), 'api', 'data');
if (!fs.existsSync(apiDataDir)) {
  fs.mkdirSync(apiDataDir, { recursive: true });
  console.log('✅ 已創建API數據目錄');
}

// 如果attached_assets目錄中有JSON文件，複製到API數據目錄
const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
if (fs.existsSync(attachedAssetsDir)) {
  const jsonFiles = fs.readdirSync(attachedAssetsDir).filter(file => file.endsWith('.json'));
  for (const file of jsonFiles) {
    fs.copyFileSync(
      path.join(attachedAssetsDir, file),
      path.join(apiDataDir, file)
    );
    console.log(`✅ 已複製 ${file} 到API數據目錄`);
  }
}

// 構建前端
console.log('🏗️ 開始構建前端...');
try {
  // 直接使用 Vite build 而不是通過 package.json 的 build 腳本
  // 這將繞過 package.json 中可能包含 Express 服務器構建部分的問題
  const clientRoot = path.join(process.cwd(), 'client');
  process.chdir(clientRoot); // 切換到 client 目錄
  execSync('npx vite build', { stdio: 'inherit' });
  process.chdir(process.cwd()); // 切回原目錄
  console.log('✅ 前端構建成功');
} catch (error) {
  console.error('❌ 前端構建失敗:', error);
  process.exit(1);
}

console.log('🎉 Vercel構建流程完成!');