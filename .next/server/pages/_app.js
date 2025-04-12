/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./index.css":
/*!*******************!*\
  !*** ./index.css ***!
  \*******************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./lib/queryClient.ts":
/*!****************************!*\
  !*** ./lib/queryClient.ts ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiRequest: () => (/* binding */ apiRequest),\n/* harmony export */   getQueryFn: () => (/* binding */ getQueryFn),\n/* harmony export */   queryClient: () => (/* binding */ queryClient)\n/* harmony export */ });\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_0__]);\n_tanstack_react_query__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nasync function throwIfResNotOk(res) {\n    if (!res.ok) {\n        const text = await res.text() || res.statusText;\n        throw new Error(`${res.status}: ${text}`);\n    }\n}\nasync function apiRequest(method, url, data) {\n    // 添加隨機緩存破壞參數\n    const cacheBreaker = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;\n    // 確保URL能正確添加查詢參數\n    const separator = url.includes('?') ? '&' : '?';\n    const urlWithCacheBreaker = `${url}${separator}${cacheBreaker}`;\n    console.log(`API請求: ${method} ${url}`);\n    try {\n        const res = await fetch(urlWithCacheBreaker, {\n            method,\n            headers: {\n                ...data ? {\n                    \"Content-Type\": \"application/json\"\n                } : {},\n                // 添加強制緩存控制頭\n                'Pragma': 'no-cache',\n                'Cache-Control': 'no-cache, no-store, must-revalidate',\n                'Expires': '0'\n            },\n            body: data ? JSON.stringify(data) : undefined,\n            credentials: \"include\",\n            // 添加緩存控制\n            cache: \"no-store\"\n        });\n        console.log(`API回應: ${url}, 狀態: ${res.status}`);\n        if (!res.ok) {\n            const errorText = await res.text();\n            console.error(`API錯誤: ${url}, 狀態: ${res.status}, 詳情:`, errorText);\n            throw new Error(`${res.status}: ${errorText || res.statusText}`);\n        }\n        return res;\n    } catch (error) {\n        console.error(`API請求失敗: ${url}`, error);\n        throw error;\n    }\n}\nconst getQueryFn = ({ on401: unauthorizedBehavior })=>async ({ queryKey })=>{\n        const url = queryKey[0];\n        console.log(`查詢請求: ${url}`, queryKey.slice(1));\n        // 添加隨機緩存破壞參數\n        const cacheBreaker = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;\n        // 確保URL能正確添加查詢參數\n        const separator = url.includes('?') ? '&' : '?';\n        const urlWithCacheBreaker = `${url}${separator}${cacheBreaker}`;\n        try {\n            const res = await fetch(urlWithCacheBreaker, {\n                credentials: \"include\",\n                headers: {\n                    // 添加強制緩存控制頭\n                    'Pragma': 'no-cache',\n                    'Cache-Control': 'no-cache, no-store, must-revalidate',\n                    'Expires': '0'\n                },\n                cache: \"no-store\" // 強制不使用緩存\n            });\n            console.log(`查詢回應: ${url}, 狀態: ${res.status}`);\n            if (unauthorizedBehavior === \"returnNull\" && res.status === 401) {\n                console.log(`認證失敗: ${url}, 根據設置返回 null`);\n                return null;\n            }\n            if (!res.ok) {\n                const errorText = await res.text();\n                console.error(`查詢錯誤: ${url}, 狀態: ${res.status}, 詳情:`, errorText);\n                throw new Error(`${res.status}: ${errorText || res.statusText}`);\n            }\n            const data = await res.json();\n            console.log(`查詢數據: ${url}, 資料長度:`, Array.isArray(data) ? data.length : '非陣列');\n            // 如果資料是空陣列但查詢URL是特定端點，嘗試緊急備用方案\n            if (Array.isArray(data) && data.length === 0 && url.includes('/api/sz-clinics')) {\n                console.log('深圳診所數據為空，嘗試直接從靜態文件加載...');\n                const baseUrl = '';\n                try {\n                    const staticDataRes = await fetch(`${baseUrl}/attached_assets/fixed_sz_clinics.json?${Math.random()}`, {\n                        cache: 'no-store'\n                    });\n                    if (staticDataRes.ok) {\n                        const staticData = await staticDataRes.json();\n                        if (Array.isArray(staticData) && staticData.length > 0) {\n                            console.log(`成功從靜態文件加載 ${staticData.length} 間診所`);\n                            return staticData;\n                        }\n                    }\n                } catch (staticError) {\n                    console.error('從靜態文件加載失敗:', staticError);\n                }\n            }\n            return data;\n        } catch (error) {\n            console.error(`查詢失敗: ${url}`, error);\n            throw error;\n        }\n    };\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_0__.QueryClient({\n    defaultOptions: {\n        queries: {\n            queryFn: getQueryFn({\n                on401: \"throw\"\n            }),\n            refetchInterval: 60000,\n            refetchOnWindowFocus: true,\n            refetchOnMount: true,\n            staleTime: 0,\n            cacheTime: 10000,\n            retry: 3,\n            retryDelay: (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 30000)\n        },\n        mutations: {\n            retry: 1\n        }\n    }\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSTt3QkFDM0MsSUFBSUMsTUFBTUMsT0FBTyxDQUFDSSxlQUFlQSxXQUFXSCxNQUFNLEdBQUcsR0FBRzs0QkFDdERwQixRQUFRQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUVzQixXQUFXSCxNQUFNLENBQUMsSUFBSSxDQUFDOzRCQUNoRCxPQUFPRzt3QkFDVDtvQkFDRjtnQkFDRixFQUFFLE9BQU9DLGFBQWE7b0JBQ3BCeEIsUUFBUVcsS0FBSyxDQUFDLGNBQWNhO2dCQUM5QjtZQUNGO1lBRUEsT0FBT25DO1FBQ1QsRUFBRSxPQUFPc0IsT0FBTztZQUNkWCxRQUFRVyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUV2QixLQUFLLEVBQUV1QjtZQUM5QixNQUFNQTtRQUNSO0lBQ0YsRUFBRTtBQUVHLE1BQU1jLGNBQWMsSUFBSS9DLDhEQUFXQSxDQUFDO0lBQ3pDZ0QsZ0JBQWdCO1FBQ2RDLFNBQVM7WUFDUEMsU0FBU2hCLFdBQVc7Z0JBQUVDLE9BQU87WUFBUTtZQUNyQ2dCLGlCQUFpQjtZQUNqQkMsc0JBQXNCO1lBQ3RCQyxnQkFBZ0I7WUFDaEJDLFdBQVc7WUFDWEMsV0FBVztZQUNYQyxPQUFPO1lBQ1BDLFlBQVksQ0FBQ0MsZUFBaUIzQyxLQUFLNEMsR0FBRyxDQUFDLE9BQU8sS0FBS0QsY0FBYztRQUNuRTtRQUNBRSxXQUFXO1lBQ1RKLE9BQU87UUFDVDtJQUNGO0FBQ0YsR0FBRyIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9saWIvcXVlcnlDbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5RnVuY3Rpb24gfSBmcm9tIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI7XG5cbmFzeW5jIGZ1bmN0aW9uIHRocm93SWZSZXNOb3RPayhyZXM6IFJlc3BvbnNlKSB7XG4gIGlmICghcmVzLm9rKSB7XG4gICAgY29uc3QgdGV4dCA9IChhd2FpdCByZXMudGV4dCgpKSB8fCByZXMuc3RhdHVzVGV4dDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7dGV4dH1gKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXBpUmVxdWVzdChcbiAgbWV0aG9kOiBzdHJpbmcsXG4gIHVybDogc3RyaW5nLFxuICBkYXRhPzogdW5rbm93biB8IHVuZGVmaW5lZCxcbik6IFByb21pc2U8UmVzcG9uc2U+IHtcbiAgLy8g5re75Yqg6Zqo5qmf57ep5a2Y56C05aOe5Y+D5pW4XG4gIGNvbnN0IGNhY2hlQnJlYWtlciA9IGBub2NhY2hlPSR7RGF0ZS5ub3coKX0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpfWA7XG4gIFxuICAvLyDnorrkv51VUkzog73mraPnorrmt7vliqDmn6XoqaLlj4PmlbhcbiAgY29uc3Qgc2VwYXJhdG9yID0gdXJsLmluY2x1ZGVzKCc/JykgPyAnJicgOiAnPyc7XG4gIGNvbnN0IHVybFdpdGhDYWNoZUJyZWFrZXIgPSBgJHt1cmx9JHtzZXBhcmF0b3J9JHtjYWNoZUJyZWFrZXJ9YDtcbiAgXG4gIGNvbnNvbGUubG9nKGBBUEnoq4vmsYI6ICR7bWV0aG9kfSAke3VybH1gKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmxXaXRoQ2FjaGVCcmVha2VyLCB7XG4gICAgICBtZXRob2QsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC4uLihkYXRhID8geyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9IDoge30pLFxuICAgICAgICAvLyDmt7vliqDlvLfliLbnt6nlrZjmjqfliLbpoK1cbiAgICAgICAgJ1ByYWdtYSc6ICduby1jYWNoZScsXG4gICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlJyxcbiAgICAgICAgJ0V4cGlyZXMnOiAnMCcsXG4gICAgICB9LFxuICAgICAgYm9keTogZGF0YSA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogdW5kZWZpbmVkLFxuICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgLy8g5re75Yqg57ep5a2Y5o6n5Yi2XG4gICAgICBjYWNoZTogXCJuby1zdG9yZVwiXG4gICAgfSk7XG4gICAgXG4gICAgY29uc29sZS5sb2coYEFQSeWbnuaHiTogJHt1cmx9LCDni4DmhYs6ICR7cmVzLnN0YXR1c31gKTtcbiAgICBcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEFQSemMr+iqpDogJHt1cmx9LCDni4DmhYs6ICR7cmVzLnN0YXR1c30sIOips+aDhTpgLCBlcnJvclRleHQpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3Jlcy5zdGF0dXN9OiAke2Vycm9yVGV4dCB8fCByZXMuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHJlcztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBBUEnoq4vmsYLlpLHmlZc6ICR7dXJsfWAsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG50eXBlIFVuYXV0aG9yaXplZEJlaGF2aW9yID0gXCJyZXR1cm5OdWxsXCIgfCBcInRocm93XCI7XG5leHBvcnQgY29uc3QgZ2V0UXVlcnlGbjogPFQ+KG9wdGlvbnM6IHtcbiAgb240MDE6IFVuYXV0aG9yaXplZEJlaGF2aW9yO1xufSkgPT4gUXVlcnlGdW5jdGlvbjxUPiA9XG4gICh7IG9uNDAxOiB1bmF1dGhvcml6ZWRCZWhhdmlvciB9KSA9PlxuICBhc3luYyAoeyBxdWVyeUtleSB9KSA9PiB7XG4gICAgY29uc3QgdXJsID0gcXVlcnlLZXlbMF0gYXMgc3RyaW5nO1xuICAgIGNvbnNvbGUubG9nKGDmn6XoqaLoq4vmsYI6ICR7dXJsfWAsIHF1ZXJ5S2V5LnNsaWNlKDEpKTtcbiAgICBcbiAgICAvLyDmt7vliqDpmqjmqZ/nt6nlrZjnoLTlo57lj4PmlbhcbiAgICBjb25zdCBjYWNoZUJyZWFrZXIgPSBgbm9jYWNoZT0ke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KX1gO1xuICAgIFxuICAgIC8vIOeiuuS/nVVSTOiDveato+eiuua3u+WKoOafpeipouWPg+aVuFxuICAgIGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmNsdWRlcygnPycpID8gJyYnIDogJz8nO1xuICAgIGNvbnN0IHVybFdpdGhDYWNoZUJyZWFrZXIgPSBgJHt1cmx9JHtzZXBhcmF0b3J9JHtjYWNoZUJyZWFrZXJ9YDtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsV2l0aENhY2hlQnJlYWtlciwge1xuICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAvLyDmt7vliqDlvLfliLbnt6nlrZjmjqfliLbpoK1cbiAgICAgICAgICAnUHJhZ21hJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZScsXG4gICAgICAgICAgJ0V4cGlyZXMnOiAnMCcsXG4gICAgICAgIH0sXG4gICAgICAgIGNhY2hlOiBcIm5vLXN0b3JlXCIgLy8g5by35Yi25LiN5L2/55So57ep5a2YXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coYOafpeipouWbnuaHiTogJHt1cmx9LCDni4DmhYs6ICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIFxuICAgICAgaWYgKHVuYXV0aG9yaXplZEJlaGF2aW9yID09PSBcInJldHVybk51bGxcIiAmJiByZXMuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgY29uc29sZS5sb2coYOiqjeitieWkseaVlzogJHt1cmx9LCDmoLnmk5roqK3nva7ov5Tlm54gbnVsbGApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihg5p+l6Kmi6Yyv6KqkOiAke3VybH0sIOeLgOaFizogJHtyZXMuc3RhdHVzfSwg6Kmz5oOFOmAsIGVycm9yVGV4dCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtyZXMuc3RhdHVzfTogJHtlcnJvclRleHQgfHwgcmVzLnN0YXR1c1RleHR9YCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgY29uc29sZS5sb2coYOafpeipouaVuOaTmjogJHt1cmx9LCDos4fmlpnplbfluqY6YCwgQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubGVuZ3RoIDogJ+mdnumZo+WIlycpO1xuICAgICAgXG4gICAgICAvLyDlpoLmnpzos4fmlpnmmK/nqbrpmaPliJfkvYbmn6XoqaJVUkzmmK/nibnlrprnq6/pu57vvIzlmJfoqabnt4rmgKXlgpnnlKjmlrnmoYhcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIGRhdGEubGVuZ3RoID09PSAwICYmIHVybC5pbmNsdWRlcygnL2FwaS9zei1jbGluaWNzJykpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ+a3seWcs+iouuaJgOaVuOaTmueCuuepuu+8jOWYl+ippuebtOaOpeW+numdnOaFi+aWh+S7tuWKoOi8iS4uLicpO1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gJyc7XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHN0YXRpY0RhdGFSZXMgPSBhd2FpdCBmZXRjaChgJHtiYXNlVXJsfS9hdHRhY2hlZF9hc3NldHMvZml4ZWRfc3pfY2xpbmljcy5qc29uPyR7TWF0aC5yYW5kb20oKX1gLCB7XG4gICAgICAgICAgICBjYWNoZTogJ25vLXN0b3JlJ1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmIChzdGF0aWNEYXRhUmVzLm9rKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aWNEYXRhID0gYXdhaXQgc3RhdGljRGF0YVJlcy5qc29uKCk7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzdGF0aWNEYXRhKSAmJiBzdGF0aWNEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYOaIkOWKn+W+numdnOaFi+aWh+S7tuWKoOi8iSAke3N0YXRpY0RhdGEubGVuZ3RofSDplpPoqLrmiYBgKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0YXRpY0RhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChzdGF0aWNFcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+W+numdnOaFi+aWh+S7tuWKoOi8ieWkseaVlzonLCBzdGF0aWNFcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYOafpeipouWkseaVlzogJHt1cmx9YCwgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9O1xuXG5leHBvcnQgY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoe1xuICBkZWZhdWx0T3B0aW9uczoge1xuICAgIHF1ZXJpZXM6IHtcbiAgICAgIHF1ZXJ5Rm46IGdldFF1ZXJ5Rm4oeyBvbjQwMTogXCJ0aHJvd1wiIH0pLFxuICAgICAgcmVmZXRjaEludGVydmFsOiA2MDAwMCwgLy8gMeWIhumQmOiHquWLlemHjeaWsOeNsuWPllxuICAgICAgcmVmZXRjaE9uV2luZG93Rm9jdXM6IHRydWUsIC8vIOeUqOaItuWbnuWIsOmggemdouaZgumHjeaWsOeNsuWPllxuICAgICAgcmVmZXRjaE9uTW91bnQ6IHRydWUsIC8vIOe1hOS7tuaOm+i8ieaZgumHjeaWsOeNsuWPllxuICAgICAgc3RhbGVUaW1lOiAwLCAvLyDmlbjmk5rlp4vntYLoppbngrrpgY7mnJ/vvIzmr4/mrKHkvb/nlKjmmYLph43mlrDnjbLlj5ZcbiAgICAgIGNhY2hlVGltZTogMTAwMDAsIC8vIOaVuOaTmuWDhee3qeWtmDEw56eSXG4gICAgICByZXRyeTogMywgLy8g5aSx5pWX5pmC6YeN6KmmM+asoVxuICAgICAgcmV0cnlEZWxheTogKGF0dGVtcHRJbmRleCkgPT4gTWF0aC5taW4oMTAwMCAqIDIgKiogYXR0ZW1wdEluZGV4LCAzMDAwMCksIC8vIOaMh+aVuOW+jOmAgOetlueVpVxuICAgIH0sXG4gICAgbXV0YXRpb25zOiB7XG4gICAgICByZXRyeTogMSwgLy8g6K6K5pu05pON5L2c6YeN6KmmMeasoVxuICAgIH0sXG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6WyJRdWVyeUNsaWVudCIsInRocm93SWZSZXNOb3RPayIsInJlcyIsIm9rIiwidGV4dCIsInN0YXR1c1RleHQiLCJFcnJvciIsInN0YXR1cyIsImFwaVJlcXVlc3QiLCJtZXRob2QiLCJ1cmwiLCJkYXRhIiwiY2FjaGVCcmVha2VyIiwiRGF0ZSIsIm5vdyIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsInNlcGFyYXRvciIsImluY2x1ZGVzIiwidXJsV2l0aENhY2hlQnJlYWtlciIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInVuZGVmaW5lZCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJlcnJvclRleHQiLCJlcnJvciIsImdldFF1ZXJ5Rm4iLCJvbjQwMSIsInVuYXV0aG9yaXplZEJlaGF2aW9yIiwicXVlcnlLZXkiLCJzbGljZSIsImpzb24iLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJiYXNlVXJsIiwic3RhdGljRGF0YVJlcyIsInN0YXRpY0RhdGEiLCJzdGF0aWNFcnJvciIsInF1ZXJ5Q2xpZW50IiwiZGVmYXVsdE9wdGlvbnMiLCJxdWVyaWVzIiwicXVlcnlGbiIsInJlZmV0Y2hJbnRlcnZhbCIsInJlZmV0Y2hPbldpbmRvd0ZvY3VzIiwicmVmZXRjaE9uTW91bnQiLCJzdGFsZVRpbWUiLCJjYWNoZVRpbWUiLCJyZXRyeSIsInJldHJ5RGVsYXkiLCJhdHRlbXB0SW5kZXgiLCJtaW4iLCJtdXRhdGlvbnMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./lib/queryClient.ts\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"(pages-dir-node)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/script */ \"(pages-dir-node)/./node_modules/next/script.js\");\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_script__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var _lib_queryClient__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/queryClient */ \"(pages-dir-node)/./lib/queryClient.ts\");\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../index.css */ \"(pages-dir-node)/./index.css\");\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__, _lib_queryClient__WEBPACK_IMPORTED_MODULE_5__]);\n([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__, _lib_queryClient__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                    name: \"viewport\",\n                    content: \"width=device-width, initial-scale=1\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                    lineNumber: 13,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 12,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_script__WEBPACK_IMPORTED_MODULE_3___default()), {\n                async: true,\n                src: \"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8354007400602759\",\n                strategy: \"afterInteractive\",\n                crossOrigin: \"anonymous\"\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 17,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClientProvider, {\n                client: _lib_queryClient__WEBPACK_IMPORTED_MODULE_5__.queryClient,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                    lineNumber: 25,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 24,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTBCO0FBRUc7QUFDSTtBQUMyQjtBQUNYO0FBQzNCO0FBRVAsU0FBU0ssSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRTs7MEJBQ0UsOERBQUNOLGtEQUFJQTswQkFDSCw0RUFBQ087b0JBQUtDLE1BQUs7b0JBQVdDLFNBQVE7Ozs7Ozs7Ozs7OzBCQUloQyw4REFBQ1Isb0RBQU1BO2dCQUNMUyxLQUFLO2dCQUNMQyxLQUFJO2dCQUNKQyxVQUFTO2dCQUNUQyxhQUFZOzs7Ozs7MEJBR2QsOERBQUNYLHNFQUFtQkE7Z0JBQUNZLFFBQVFYLHlEQUFXQTswQkFDdEMsNEVBQUNFO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFJaEMiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvcGFnZXMvX2FwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IFNjcmlwdCBmcm9tICduZXh0L3NjcmlwdCc7XG5pbXBvcnQgeyBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCB7IHF1ZXJ5Q2xpZW50IH0gZnJvbSAnLi4vbGliL3F1ZXJ5Q2xpZW50JztcbmltcG9ydCAnLi4vaW5kZXguY3NzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEhlYWQ+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiIC8+XG4gICAgICA8L0hlYWQ+XG4gICAgICBcbiAgICAgIHsvKiBHb29nbGUgQWRTZW5zZSDpqZforYnnqIvlvI/norwgLSDkvb/nlKggbmV4dC9zY3JpcHQg6ICM5LiN5piv5ZyoIGhlYWQg5Lit5re75YqgICovfVxuICAgICAgPFNjcmlwdFxuICAgICAgICBhc3luY1xuICAgICAgICBzcmM9XCJodHRwczovL3BhZ2VhZDIuZ29vZ2xlc3luZGljYXRpb24uY29tL3BhZ2VhZC9qcy9hZHNieWdvb2dsZS5qcz9jbGllbnQ9Y2EtcHViLTgzNTQwMDc0MDA2MDI3NTlcIlxuICAgICAgICBzdHJhdGVneT1cImFmdGVySW50ZXJhY3RpdmVcIlxuICAgICAgICBjcm9zc09yaWdpbj1cImFub255bW91c1wiXG4gICAgICAvPlxuICAgICAgXG4gICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuICAgIDwvPlxuICApO1xufSJdLCJuYW1lcyI6WyJSZWFjdCIsIkhlYWQiLCJTY3JpcHQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwicXVlcnlDbGllbnQiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJtZXRhIiwibmFtZSIsImNvbnRlbnQiLCJhc3luYyIsInNyYyIsInN0cmF0ZWd5IiwiY3Jvc3NPcmlnaW4iLCJjbGllbnQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();