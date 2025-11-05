const express = require('express');
const app = express();

// مهم: لازم نحط الـ body parser
app.use(express.json());

// أبسط ويب هوك ممكن
app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received successfully!');
  
  // رد سريع علشان تليجرام مايعترضش
  res.status(200).json({ 
    status: 'ok',
    message: 'Webhook is working perfectly!'
  });
});

// صفحة فحص للويب هوك
app.get('/webhook', (req, res) => {
  res.json({ 
    status: '🟢 ACTIVE',
    endpoint: '/webhook (POST)',
    instructions: 'Telegram bot webhook endpoint'
  });
});

// صفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 Bot Server is RUNNING</h1>
    <p>Webhook: <code>/webhook</code> ✅</p>
    <p>Check: <a href="/webhook">/webhook</a></p>
  `);
});

// لا تنسى الـ export
module.exports = app;
