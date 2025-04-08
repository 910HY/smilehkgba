#!/bin/bash
cd client && npx vite build
cd ..
node server.js
