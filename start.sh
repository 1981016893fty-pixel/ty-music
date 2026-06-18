#!/bin/bash

# TY Music 服务器启动脚本

cd "$(dirname "$0")"

echo "=========================================="
echo "  TY Music 服务器启动脚本"
echo "=========================================="
echo ""

# 停止旧进程
echo "[1/4] 停止旧进程..."
pkill -f "server.js" 2>/dev/null
sleep 2

# 检查端口
echo "[2/4] 检查端口 8899..."
if lsof -i :8899 >/dev/null 2>&1; then
  echo "⚠️  端口 8899 已被占用，正在释放..."
  lsof -ti :8899 | xargs kill -9 2>/dev/null
  sleep 1
fi

# 启动服务器
echo "[3/4] 启动服务器..."
nohup node server.js > server.log 2>&1 &
PID=$!
echo $PID > server.pid

# 等待启动
echo "[4/4] 等待服务器启动..."
sleep 3

# 检查状态
if kill -0 $PID 2>/dev/null; then
  echo ""
  echo "✅ 服务器启动成功！"
  echo "   PID: $PID"
  echo "   地址: <ADDRESS_REMOVED>
  echo ""
  echo "测试命令:"
  echo "  curl http://localhost:8899/api/health"
  echo "  curl \"http://localhost:8899/api/music/search?keywords=周杰伦&limit=2\""
  echo ""
  echo "查看日志: tail -f server.log"
  echo "停止服务器: kill $PID"
  echo ""
else
  echo ""
  echo "❌ 服务器启动失败！"
  echo "查看错误日志:"
  cat server.log
  exit 1
fi
