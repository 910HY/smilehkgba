/**
 * 標準化地址，移除特殊字符
 */
export function standardizeAddress(rawAddress: string): string {
  return rawAddress
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ') // 保留中文、英文和數字，其他轉為空格
    .replace(/\s+/g, ' ')                       // 多個空格替換為單個空格
    .trim();                                    // 移除首尾空格
}

/**
 * 生成高德地圖搜索URL
 * 用於中國區域的地址
 */
export function generateAmapSearchUrl(address: string): string {
  const standardizedAddress = standardizeAddress(address);
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(standardizedAddress)}&src=mypage&callnative=0`;
}