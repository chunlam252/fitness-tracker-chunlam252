#!/bin/bash
cd "$(dirname "$0")"
echo "🏋️  啟動 FitTrack 本地預覽..."

# 關閉已佔用 8080 的程式
lsof -ti:8080 | xargs kill -9 2>/dev/null

sleep 1
npx --yes serve . -p 8080 &
sleep 2
open http://localhost:8080
echo "✅ 打開瀏覽器 http://localhost:8080"
wait
