// 啟動 Next.js 開發服務器
import { execSync } from 'child_process';

// 在 Replit 環境強制使用端口 5000（工作流配置要求）
const port = 5000;

console.log(`📦 啟動 Next.js 開發服務器（Replit 強制兼容模式，port: ${port}）...`);

try {
  // 清理 static-server（可選）
  try {
    execSync('pkill -f static-server.js || true', { stdio: 'inherit' });
    console.log('已停止之前可能運行的靜態伺服器');
  } catch {}

  execSync('sleep 2', { stdio: 'inherit' });

  // 為了與 Replit 工作流兼容，我們強制使用 PORT=5000
  process.env.PORT = port.toString();
  execSync(`PORT=${port} npx next dev -p ${port}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 啟動失敗:', error);
  process.exit(1);
}