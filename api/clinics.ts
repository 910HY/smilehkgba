import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const base = path.join(process.cwd(), 'api', 'data');
    const hk = JSON.parse(fs.readFileSync(path.join(base, 'clinic_list_hkcss_cleaned.json'), 'utf8'));
    const ngo = JSON.parse(fs.readFileSync(path.join(base, 'ngo_clinics_cleaned.json'), 'utf8'));
    const sz = JSON.parse(fs.readFileSync(path.join(base, 'shenzhen_dental_clinics_20250407.json'), 'utf8'));

    res.status(200).json([...hk, ...ngo, ...sz]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read clinic data', message: (error as Error).message });
  }
}