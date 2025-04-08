import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response } from 'express';

// 在ESM中獲取當前文件的目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 路徑到JSON檔案
const hkClinicsPath = path.join(__dirname, '../attached_assets/clinic_list_hkcss_cleaned.json');
const ngoClinicsPath = path.join(__dirname, '../attached_assets/ngo_clinics_cleaned.json');
const szClinicsPath = path.join(__dirname, '../attached_assets/shenzhen_dental_clinics_20250407.json');

// 讀取JSON檔案並解析
export function getHKClinics(_req: Request, res: Response) {
  try {
    const data = fs.readFileSync(hkClinicsPath, 'utf8');
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error('Error reading HK clinics file:', error);
    res.status(500).json({ error: 'Failed to read clinic data' });
  }
}

export function getNGOClinics(_req: Request, res: Response) {
  try {
    const data = fs.readFileSync(ngoClinicsPath, 'utf8');
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error('Error reading NGO clinics file:', error);
    res.status(500).json({ error: 'Failed to read clinic data' });
  }
}

export function getSZClinics(_req: Request, res: Response) {
  try {
    const data = fs.readFileSync(szClinicsPath, 'utf8');
    const clinics = JSON.parse(data);
    res.json(clinics);
  } catch (error) {
    console.error('Error reading SZ clinics file:', error);
    res.status(500).json({ error: 'Failed to read clinic data' });
  }
}

// 取得所有診所資料（合併三個來源）
export function getAllClinics(_req: Request, res: Response) {
  try {
    const hkData = fs.readFileSync(hkClinicsPath, 'utf8');
    const ngoData = fs.readFileSync(ngoClinicsPath, 'utf8');
    const szData = fs.readFileSync(szClinicsPath, 'utf8');
    
    const hkClinics = JSON.parse(hkData);
    const ngoClinics = JSON.parse(ngoData);
    const szClinics = JSON.parse(szData);
    
    const allClinics = [...hkClinics, ...ngoClinics, ...szClinics];
    
    res.json(allClinics);
  } catch (error) {
    console.error('Error reading clinic data files:', error);
    res.status(500).json({ error: 'Failed to read clinic data' });
  }
}