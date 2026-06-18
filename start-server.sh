#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动 TY Music 服务器..."
node server-simple.js > server.log 2>&1 &
echo $! > server.pid
echo "服务器已启动 (PID: $(cat server.pid))"
echo "日志文件: server.log"
sleep 2
if ps -p $(cat server.pid) > /dev/null 2>&1; then
  echo "✓ 服务器运行正常"
  cat server.log
else
  echo "✗ 服务器启动失败"
  cat server.log
fi
