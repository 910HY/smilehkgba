#!/bin/bash
cd client && npm run build
cd ..
node server.cjs
