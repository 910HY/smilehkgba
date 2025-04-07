// generateAmapLink.ts

export function standardizeAddress(rawAddress: string): string {
  let addr = rawAddress.trim();

  // 避免重複加 "中國"
  if (!addr.startsWith("中國")) {
    addr = "中國" + addr;
  }

  // 移除重複「中國中國」
  addr = addr.replace(/^中國+/, "中國");

  // 補全可能遺漏的「市」
  if (!addr.includes("市")) {
    addr = "中國深圳市" + addr.replace(/^中國/, "");
  }

  return encodeURIComponent(addr);
}

export function generateAmapSearchUrl(address: string): string {
  const encodedAddress = standardizeAddress(address);
  return `https://www.amap.com/search?query=${encodedAddress}`;
}

// 範例用法（React Component 中）
/*
import { generateAmapSearchUrl } from './generateAmapLink';

const ClinicMapButton = ({ clinic }) => {
  const mapLink = generateAmapSearchUrl(clinic.address);

  return (
    <a
      href={mapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-orange-400 underline"
    >
      在高德地圖查看
    </a>
  );
};
*/