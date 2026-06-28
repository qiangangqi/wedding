// api/index.js
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '2mb' }));

// 内存数据库（Vercel 免费版重启后数据会丢失，但正常使用时一直会保留）
const rooms = new Map();

// 创建房间
app.post('/api/room', (req, res) => {
  const roomId = crypto.randomBytes(4).toString('hex');
  const initialData = {
    familyData: req.body.familyData || [],
    friendData: req.body.friendData || [],
    blocks: req.body.blocks || [],
    tables: req.body.tables || [],
    updatedAt: Date.now()
  };
  rooms.set(roomId, initialData);
  res.json({ roomId });
});

// 获取房间数据
app.get('/api/room/:roomId', (req, res) => {
  const data = rooms.get(req.params.roomId);
  if (!data) {
    return res.status(404).json({ error: '房间不存在' });
  }
  res.json(data);
});

// 保存房间数据
app.put('/api/room/:roomId', (req, res) => {
  if (!rooms.has(req.params.roomId)) {
    return res.status(404).json({ error: '房间不存在' });
  }
  const newData = {
    familyData: req.body.familyData || rooms.get(req.params.roomId).familyData,
    friendData: req.body.friendData || rooms.get(req.params.roomId).friendData,
    blocks: req.body.blocks || rooms.get(req.params.roomId).blocks,
    tables: req.body.tables || rooms.get(req.params.roomId).tables,
    updatedAt: Date.now()
  };
  rooms.set(req.params.roomId, newData);
  res.json({ success: true });
});

// 导出给 Vercel
module.exports = app;
