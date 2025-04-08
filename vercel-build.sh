#!/bin/bash

# Create folders
mkdir -p api/data

# Copy JSON data files
cp attached_assets/clinic_list_hkcss_cleaned.json api/data/
cp attached_assets/ngo_clinics_cleaned.json api/data/
cp attached_assets/shenzhen_dental_clinics_20250407.json api/data/

# Build the frontend
echo "Building frontend..."
cd client && npm run build
