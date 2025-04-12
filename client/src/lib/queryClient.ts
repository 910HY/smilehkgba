import { QueryClient } from '@tanstack/react-query';

/**
 * 檢查響應是否成功，如果不成功則拋出錯誤
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // 如果無法解析JSON，繼續使用原始錯誤消息
    }
    throw new Error(errorMessage);
  }
}

/**
 * 通用API請求函數，帶錯誤處理
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  console.log('API請求:', options.method || 'GET', url);
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API回應:', url, '狀態:', res.status);
    
    await throwIfResNotOk(res);
    
    if (res.status === 204) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('API請求錯誤:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * 創建查詢函數的工廠
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: any) => Promise<T> = ({ on401 }) => {
  return async ({ queryKey }) => {
    try {
      const [url, params] = Array.isArray(queryKey) 
        ? [queryKey[0], queryKey.slice(1)] 
        : [queryKey, []];
      
      let finalUrl = url;
      
      // 添加隨機參數以避免緩存
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      const data = await apiRequest(finalUrl);
      return data;
    } catch (error: any) {
      if (error.message.includes('401') && on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
};

/**
 * 創建與配置 QueryClient 實例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      queryFn: getQueryFn({ on401: "throw" }),
    },
  },
});