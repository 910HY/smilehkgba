// 用於 Replit 的啟動腳本 - 強制使用端口 5000（與 Replit 工作流要求一致）
import { execSync } from 'child_process';

// 在 Replit 環境中固定使用端口 5000
const port = 5000;

console.log(`📦 啟動 Next.js 開發服務器（Replit 兼容模式，port: ${port}）...`);

try {
  // 停止背景 static server（可選）
  try {
    execSync('pkill -f static-server.js || true', { stdio: 'inherit' });
    console.log('已停止之前可能運行的靜態伺服器');
  } catch {}

  // 等待端口釋放
  execSync('sleep 2', { stdio: 'inherit' });

  // 使用固定的 5000 端口啟動 Next.js
  execSync(`PORT=${port} npx next dev -p ${port}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 啟動失敗:', error);
  process.exit(1);
}