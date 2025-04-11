import React from 'react';
import { Route, Switch } from 'wouter';
import HomePage from '../pages/index';
import ArticlesPage from '../pages/articles/index';

/**
 * 主要路由配置
 */
const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/articles" component={ArticlesPage} />
      
      {/* 404 頁面 */}
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-orange-500">
          <div className="text-center p-6 bg-slate-800 rounded-lg shadow-lg max-w-md">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="mb-6 text-orange-300">找不到您請求的頁面。</p>
            <a 
              href="/" 
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              返回首頁
            </a>
          </div>
        </div>
      </Route>
    </Switch>
  );
};

export default Routes;