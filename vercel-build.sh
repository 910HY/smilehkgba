#!/bin/bash

# 確保api/data目錄存在
mkdir -p api/data

# 複製數據文件
cp attached_assets/clinic_list_hkcss_cleaned.json api/data/
cp attached_assets/ngo_clinics_cleaned.json api/data/
cp attached_assets/shenzhen_dental_clinics_20250407.json api/data/
