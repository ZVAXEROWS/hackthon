// تثبيت الحزم: npm install express body-parser
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // يخدم index.html

// مجرد مثال: نخزن مؤقتًا في مصفوفة
const saved = [];

app.post('/save-location', (req, res) => {
  const { lat, lng, address } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ ok: false, message: 'إحداثيات غير صحيحة' });
  }
  const entry = { lat, lng, address, ts: new Date().toISOString() };
  saved.push(entry);
  res.json({ ok: true, saved: entry });
});

app.get('/saved', (req, res) => {
  res.json(saved);
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));

