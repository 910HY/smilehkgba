import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // 添加隨機緩存破壞參數
  const cacheBreaker = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  // 確保URL能正確添加查詢參數
  const separator = url.includes('?') ? '&' : '?';
  const urlWithCacheBreaker = `${url}${separator}${cacheBreaker}`;
  
  console.log(`API請求: ${method} ${url}`);
  try {
    const res = await fetch(urlWithCacheBreaker, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        // 添加強制緩存控制頭
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Expires': '0',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      // 添加緩存控制
      cache: "no-store"
    });
    
    console.log(`API回應: ${url}, 狀態: ${res.status}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API錯誤: ${url}, 狀態: ${res.status}, 詳情:`, errorText);
      throw new Error(`${res.status}: ${errorText || res.statusText}`);
    }
    
    return res;
  } catch (error) {
    console.error(`API請求失敗: ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`查詢請求: ${url}`, queryKey.slice(1));
    
    // 添加隨機緩存破壞參數
    const cacheBreaker = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // 確保URL能正確添加查詢參數
    const separator = url.includes('?') ? '&' : '?';
    const urlWithCacheBreaker = `${url}${separator}${cacheBreaker}`;
    
    try {
      const res = await fetch(urlWithCacheBreaker, {
        credentials: "include",
        headers: {
          // 添加強制緩存控制頭
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Expires': '0',
        },
        cache: "no-store" // 強制不使用緩存
      });
      
      console.log(`查詢回應: ${url}, 狀態: ${res.status}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`認證失敗: ${url}, 根據設置返回 null`);
        return null;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`查詢錯誤: ${url}, 狀態: ${res.status}, 詳情:`, errorText);
        throw new Error(`${res.status}: ${errorText || res.statusText}`);
      }
      
      const data = await res.json();
      console.log(`查詢數據: ${url}, 資料長度:`, Array.isArray(data) ? data.length : '非陣列');
      
      // 如果資料是空陣列但查詢URL是特定端點，嘗試緊急備用方案
      if (Array.isArray(data) && data.length === 0 && url.includes('/api/sz-clinics')) {
        console.log('深圳診所數據為空，嘗試直接從靜態文件加載...');
        const baseUrl = '';
        
        try {
          const staticDataRes = await fetch(`${baseUrl}/attached_assets/fixed_sz_clinics.json?${Math.random()}`, {
            cache: 'no-store'
          });
          
          if (staticDataRes.ok) {
            const staticData = await staticDataRes.json();
            if (Array.isArray(staticData) && staticData.length > 0) {
              console.log(`成功從靜態文件加載 ${staticData.length} 間診所`);
              return staticData;
            }
          }
        } catch (staticError) {
          console.error('從靜態文件加載失敗:', staticError);
        }
      }
      
      return data;
    } catch (error) {
      console.error(`查詢失敗: ${url}`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: 60000, // 1分鐘自動重新獲取
      refetchOnWindowFocus: true, // 用戶回到頁面時重新獲取
      refetchOnMount: true, // 組件掛載時重新獲取
      staleTime: 0, // 數據始終視為過期，每次使用時重新獲取
      cacheTime: 10000, // 數據僅緩存10秒
      retry: 3, // 失敗時重試3次
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指數後退策略
    },
    mutations: {
      retry: 1, // 變更操作重試1次
    },
  },
});
