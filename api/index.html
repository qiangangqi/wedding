const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json({ limit: '1mb' }));

const rooms = new Map();

app.post('/api/room', (req, res) => {
  const roomId = crypto.randomBytes(4).toString('hex');
  rooms.set(roomId, {
    familyData: req.body.familyData || [],
    friendData: req.body.friendData || [],
    blocks: req.body.blocks || [],
    tables: req.body.tables || [],
    updatedAt: Date.now()
  });
  res.json({ roomId });
});

app.get('/api/room/:roomId', (req, res) => {
  const data = rooms.get(req.params.roomId);
  if (!data) return res.status(404).json({ error: '房间不存在' });
  res.json(data);
});

app.put('/api/room/:roomId', (req, res) => {
  if (!rooms.has(req.params.roomId)) return res.status(404).json({ error: '房间不存在' });
  const old = rooms.get(req.params.roomId);
  const updated = {
    familyData: req.body.familyData || old.familyData,
    friendData: req.body.friendData || old.friendData,
    blocks: req.body.blocks || old.blocks,
    tables: req.body.tables || old.tables,
    updatedAt: Date.now()
  };
  rooms.set(req.params.roomId, updated);
  res.json({ success: true });
});

module.exports = app;
