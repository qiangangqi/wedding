const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const rooms = new Map();

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

app.get('/api/room/:roomId', (req, res) => {
  const data = rooms.get(req.params.roomId);
  if (!data) return res.status(404).json({ error: '房间不存在' });
  res.json(data);
});

app.put('/api/room/:roomId', (req, res) => {
  if (!rooms.has(req.params.roomId)) return res.status(404).json({ error: '房间不存在' });
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
