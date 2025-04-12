export interface RegionMapping {
  [key: string]: string[];
}

export interface DetailedRegionMapping {
  [key: string]: string[];
}

export interface RegionGrouping {
  [key: string]: {
    label: string;
    regions: string[];
  }[];
}

// 主要區域分類
export const regions: RegionMapping = {
  '香港': ['港島區', '九龍區', '新界區'],
  '大灣區': ['深圳市', '廣州市', '珠海市', '中山市', '東莞市', '惠州市', '佛山市', '江門市', '肇慶市'],
};

// 港島區子區域
export const hkRegionGroups: RegionGrouping = {
  '港島區': [
    { label: '中西區', regions: ['中環', '上環', '西環', '山頂', '金鐘'] },
    { label: '灣仔區', regions: ['灣仔', '銅鑼灣', '跑馬地', '大坑', '渣甸山'] },
    { label: '東區', regions: ['北角', '鰂魚涌', '太古', '西灣河', '筲箕灣', '杏花邨', '柴灣'] },
    { label: '南區', regions: ['香港仔', '鴨脷洲', '黃竹坑', '薄扶林', '數碼港', '淺水灣', '赤柱'] },
  ],
};

// 九龍區子區域
export const klnRegionGroups: RegionGrouping = {
  '九龍區': [
    { label: '油尖旺區', regions: ['油麻地', '尖沙咀', '旺角', '佐敦', '大角咀'] },
    { label: '深水埗區', regions: ['深水埗', '長沙灣', '荔枝角', '石硤尾', '又一村', '大窩坪'] },
    { label: '九龍城區', regions: ['九龍城', '九龍塘', '何文田', '土瓜灣', '紅磡'] },
    { label: '黃大仙區', regions: ['黃大仙', '鑽石山', '新蒲崗', '慈雲山', '樂富', '牛池灣', '彩虹'] },
    { label: '觀塘區', regions: ['觀塘', '秀茂坪', '藍田', '牛頭角', '九龍灣', '彩福', '油塘'] },
  ],
};

// 新界區子區域
export const ntRegionGroups: RegionGrouping = {
  '新界區': [
    { 
      label: '西部', 
      regions: ['荃灣', '深井', '葵涌', '青衣', '馬灣', '屯門', '元朗', '天水圍', '洪水橋'] 
    },
    { 
      label: '北部', 
      regions: ['上水', '粉嶺', '石湖墟', '沙頭角', '大埔', '太和'] 
    },
    { 
      label: '東部', 
      regions: ['沙田', '大圍', '火炭', '馬鞍山', '西貢', '將軍澳', '坑口', '調景嶺'] 
    },
    { 
      label: '中部及離島', 
      regions: ['大嶼山', '東涌', '欣澳', '愉景灣', '長洲', '南丫島', '大澳', '梅窩'] 
    },
  ],
};

// 深圳區域
export const szRegionGroups: RegionGrouping = {
  '深圳市': [
    { label: '南山區', regions: ['南山', '蛇口', '前海', '科技園'] },
    { label: '福田區', regions: ['福田', '華強北', '皇崗', '福民'] },
    { label: '羅湖區', regions: ['羅湖', '東門', '黃貝', '文錦渡'] },
    { label: '龍崗區', regions: ['龍崗', '布吉', '橫崗', '坪地'] },
    { label: '寶安區', regions: ['寶安', '西鄉', '沙井', '光明'] },
    { label: '龍華區', regions: ['龍華', '民治', '觀瀾'] },
    { label: '坪山區', regions: ['坪山', '坑梓'] },
    { label: '鹽田區', regions: ['鹽田', '沙頭角', '梅沙'] },
  ],
};

// 診所類型
export const clinicTypes = ["全部", "私家診所", "NGO社企"];

// 地區顯示名稱對照
export const regionDisplayNames = {
  '深圳市': '深圳市',
  '福田區': '福田區',
  '南山區': '南山區',
  '羅湖區': '羅湖區',
  '寶安區': '寶安區',
  '龍崗區': '龍崗區',
  '龍華區': '龍華區',
  '坪山區': '坪山區',
  '鹽田區': '鹽田區',
  // ... 其他地區的顯示名稱
};

// 詳細地區對照
export const detailedRegions: DetailedRegionMapping = {
  '香港': ['港島區', '九龍區', '新界區'],
  '港島區': ['中西區', '灣仔區', '東區', '南區'],
  '九龍區': ['油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區'],
  '新界區': ['荃灣區', '屯門區', '元朗區', '北區', '大埔區', '沙田區', '西貢區', '葵青區', '離島區'],
  '大灣區': ['深圳市', '廣州市', '珠海市', '中山市', '東莞市', '惠州市', '佛山市', '江門市', '肇慶市'],
  '深圳市': ['南山區', '福田區', '羅湖區', '龍崗區', '寶安區', '龍華區', '坪山區', '鹽田區'],
};