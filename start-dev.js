// 啟動 Next.js 開發服務器
import { execSync } from 'child_process';

// 在 Replit 環境中強制使用端口 5000
const isReplit = process.env.REPL_ID || process.env.REPL_SLUG;
const port = isReplit ? 5000 : (process.env.PORT || 3000);

console.log(`📦 啟動 Next.js 開發服務器（${isReplit ? 'Replit 環境' : '普通模式'}，port: ${port}）...`);

try {
  // 停止背景 static server（可選）
  try {
    execSync('pkill -f static-server.js || true', { stdio: 'inherit' });
    console.log('已停止之前可能運行的靜態伺服器');
  } catch {}

  // 等待端口釋放
  execSync('sleep 2', { stdio: 'inherit' });

  // 改為使用環境變數 PORT（Replit 會注入）
  execSync(`npx next dev -p ${port}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 啟動失敗:', error);
  process.exit(1);
}