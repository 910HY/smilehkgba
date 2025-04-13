// Next.js 構建腳本
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('📦 開始 Next.js 構建...');
try {
  // 直接執行 Next.js 構建（從根目錄）
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js 構建完成！');
} catch (error) {
  console.error('❌ 構建失敗:', error);
  process.exit(1);
}