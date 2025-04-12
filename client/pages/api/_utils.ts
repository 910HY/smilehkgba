import path from 'path';
import fs from 'fs';

// 確定應用根目錄
export const rootDir = process.env.VERCEL ? process.cwd() : path.resolve(process.cwd());

// 獲取文件路徑的通用函數
export function getFilePath(...pathSegments: string[]): string {
  return path.join(rootDir, ...pathSegments);
}

// 讀取並解析JSON文件
export function readJsonFile(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw new Error(`Cannot read file: ${error.message}`);
  }
}

// 確保目錄存在
export function ensureDirectoryExists(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist, creating: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
    return false;
  }
  return true;
}

// 處理請求的輔助函數
export function handleApiResponse(res: any, data: any) {
  return res.status(200).json(data);
}

// 處理錯誤的輔助函數
export function handleApiError(res: any, error: any, message: string) {
  console.error(message, error);
  return res.status(500).json({ 
    error: message, 
    details: error.message || 'Unknown error' 
  });
}