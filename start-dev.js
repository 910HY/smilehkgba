// 啟動開發服務器
import { execSync } from 'child_process';

console.log('📦 啟動開發服務器...');
try {
  // 使用 node dev-server.js 啟動
  execSync('node dev-server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 啟動失敗:', error);
  process.exit(1);
}