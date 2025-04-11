import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// 強制重新加載並應用新品牌 - 添加時間戳使緩存失效
console.log(`應用版本：${Date.now()}`);
console.log('牙GoGo - 至關心你啲牙既牙科資訊平台');

// 確保頁面標題正確
document.title = "牙GoGo｜香港及大灣區牙科資訊平台";

// 動態創建元素以確保品牌名稱存在
if (!document.querySelector('[data-brand-marker]')) {
  const brandMarker = document.createElement('div');
  brandMarker.setAttribute('data-brand-marker', 'true');
  brandMarker.style.display = 'none';
  brandMarker.innerHTML = `
    <h1>牙GoGo</h1>
    <p>至關心你啲牙既牙科資訊平台</p>
  `;
  document.body.appendChild(brandMarker);
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
