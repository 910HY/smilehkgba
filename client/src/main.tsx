import { createRoot } from "react-dom/client";
import { Route, Switch, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// 導入頁面
import HomePage from "../pages/index";
import ArticlesPage from "../pages/articles/index";

// 強制重新加載並應用新品牌 - 添加時間戳使緩存失效
console.log(`牙GoGo - 正在初始化應用...`);
console.log(`應用版本：${Date.now()}`);
console.log('正在嘗試載入主應用...');

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

// 頁面路由
const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/articles" component={ArticlesPage} />
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-black text-orange-500">
            <div className="text-center p-6">
              <h1 className="text-4xl font-bold mb-4">404 - 頁面不存在</h1>
              <p className="mb-6 text-orange-300">找不到您請求的頁面。</p>
              <a href="/" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                返回首頁
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppRouter />
  </QueryClientProvider>
);
