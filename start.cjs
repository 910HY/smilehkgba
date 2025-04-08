// 本地開發啟動腳本 (CommonJS)
const { exec } = require("child_process");

console.log("正在啟動 SmileHK 本地開發服務器...");

// 啟動 CommonJS 格式的服務器
exec("node server.cjs", (error, stdout, stderr) => {
  if (error) {
    console.error(`執行錯誤: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`錯誤輸出: ${stderr}`);
  }
  console.log(`標準輸出: ${stdout}`);
});

console.log("SmileHK 服務器已啟動，請在瀏覽器中訪問 http://localhost:5000");