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
  console.log(`API請求: ${method} ${url}`);
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      // 添加緩存控制
      cache: "no-cache"
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
    
    try {
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-cache" // 不使用緩存
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
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5分鐘內視為新鮮數據
      retry: 3, // 失敗時重試3次
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指數後退策略
    },
    mutations: {
      retry: 1, // 變更操作重試1次
    },
  },
});
