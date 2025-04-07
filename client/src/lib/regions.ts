export interface RegionMapping {
  [key: string]: string[];
}

// 完整區域與細分地區映射
export const regions: RegionMapping = {
  '香港島': ['中西區', '灣仔區', '東區', '南區'],
  '九龍': ['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'],
  '新界': ['葵青區', '荃灣區', '屯門區', '元朗區', '北區', '大埔區', '沙田區', '西貢區', '離島區'],
  '大灣區': ['羅湖區', '福田區', '南山區', '寶安區', '龍崗區', '龍華區', '坪山區', '澳門']
};

// 診所類型
export const clinicTypes = ["全部", "私家診所", "NGO社企"];

// 區域顯示名稱（如果需要中英雙語）
export const regionDisplayNames = {
  "香港島": "香港島 Hong Kong Island",
  "九龍": "九龍 Kowloon",
  "新界": "新界 New Territories",
  "大灣區": "大灣區 Greater Bay Area"
};
