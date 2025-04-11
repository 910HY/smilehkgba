import json
import re

# 讀取原始文件
with open('shenzhen_dental_clinics_fixed.json', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到兩個JSON數組並合併
# 先匹配第一個JSON數組的內容
first_part = content.split("]")[0] + "]"

# 嘗試解析第一部分，確保格式正確
json.loads(first_part)

# 使用正則表達式找到第二個JSON數組
second_part_match = re.search(r'\[\s*{.+\}\s*\]', content.split("]")[1], re.DOTALL)
if second_part_match:
    second_part = second_part_match.group(0)
else:
    second_part = "[]"  # 如果沒有匹配到，使用空數組

# 嘗試解析第二部分，確保格式正確
second_part_data = json.loads(second_part)

# 合併兩個部分
first_part_data = json.loads(first_part)
merged_data = first_part_data + second_part_data

# 寫入新文件
with open('fixed_sz_clinics.json', 'w', encoding='utf-8') as f:
    json.dump(merged_data, f, ensure_ascii=False, indent=2)

print(f"成功合併，共有 {len(merged_data)} 條記錄")
