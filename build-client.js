// 生產環境構建腳本
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('📦 開始構建客戶端...');

try {
  // 進入客戶端目錄
  process.chdir(path.join(__dirname, 'client'));
  
  // 執行 vite build
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ 客戶端構建完成!');
} catch (error) {
  console.error('❌ 構建失敗:', error);
  process.exit(1);
}