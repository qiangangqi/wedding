// server.js
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json({ limit: '2mb' }));        // 允许大数据，因为名单可能有几百人
app.use(express.static(path.join(__dirname, 'public'))); // 提供静态前端文件

// 内存数据库（如需持久化，可替换为文件读写或使用云存储）
const rooms = new Map();   // roomId -> { familyData, friendData, blocks, tables, updatedAt }

// 创建新房间
app.post('/api/room', (req, res) => {
  const roomId = crypto.randomBytes(4).toString('hex'); // 8位随机ID
  const initialData = {
    familyData: req.body.familyData || [],
    friendData: req.body.friendData || [],
    blocks: req.body.blocks || [],
    tables: req.body.tables || [],
    updatedAt: Date.now()
  };
  rooms.set(roomId, initialData);
  console.log(`房间 ${roomId} 已创建`);
  res.json({ roomId });
});

// 获取房间数据
app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const data = rooms.get(roomId);
  if (!data) {
    return res.status(404).json({ error: '房间不存在' });
  }
  res.json(data);
});

// 保存房间数据
app.put('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  if (!rooms.has(roomId)) {
    return res.status(404).json({ error: '房间不存在' });
  }
  // 更新数据
  const newData = {
    familyData: req.body.familyData || rooms.get(roomId).familyData,
    friendData: req.body.friendData || rooms.get(roomId).friendData,
    blocks: req.body.blocks || rooms.get(roomId).blocks,
    tables: req.body.tables || rooms.get(roomId).tables,
    updatedAt: Date.now()
  };
  rooms.set(roomId, newData);
  console.log(`房间 ${roomId} 已更新`);
  res.json({ success: true });
});

// 所有其他请求返回前端 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vercel 会通过环境变量 PORT 传递端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`婚宴座位管理服务运行在 http://localhost:${port}`);
});