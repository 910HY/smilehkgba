import path from 'path';
import fs from 'fs';

export default function handler(req: any, res: any) {
  try {
    const filePath = path.join(process.cwd(), 'api', 'data', 'clinic_list_hkcss_cleaned.json');
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error fetching HK clinics:', error);
    res.status(500).json({ error: 'Failed to fetch HK clinics data' });
  }
}