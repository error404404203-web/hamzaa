const express = require('express');
const app = express();

app.use(express.json());

// أبسط ويب هوك ممكن
app.post('/webhook', (req, res) => {
  console.log('📩 ويب هوك مستلم:', req.body);
  
  res.json({ 
    status: 'success',
    message: 'Webhook is working!',
    timestamp: new Date().toISOString()
  });
});

// صفحة فحص
app.get('/webhook', (req, res) => {
  res.json({ 
    status: '🟢 Active',
    message: 'Send POST requests to this endpoint for Telegram bot'
  });
});

// صفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 Bot Server</h1>
    <p>Webhook: <code>/webhook</code></p>
    <p>Status: 🟢 Active</p>
    <a href="/webhook">فحص الويب هوك</a>
  `);
});

module.exports = app;
