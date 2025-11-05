const express = require('express');
const app = express();

// مهم: لازم نحط الـ json parser
app.use(express.json());

// صفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>لوحة تحكم البوت</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                min-height: 100vh;
                padding: 20px;
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
                margin-bottom: 30px;
                backdrop-filter: blur(10px);
            }
            .controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .btn {
                background: rgba(255,255,255,0.2);
                border: none;
                padding: 20px;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s;
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.05);
            }
            .status {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
            }
            .message {
                background: rgba(255,255,255,0.2);
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 لوحة تحكم البوت</h1>
                <p>البوت: <b>ناش</b> (@nohashbbot)</p>
                <p>الحالة: <span style="color: #90EE90;">🟢 نشط على Vercel</span></p>
            </div>

            <div class="status">
                <h3>🚀 الأوامر المتاحة</h3>
                <p>إختر أمراً لإرساله للأجهزة المتصلة</p>
            </div>

            <div class="controls">
                <button class="btn" onclick="sendCommand('vibrate')">📳 اهتزاز</button>
                <button class="btn" onclick="sendCommand('camera')">📸 كاميرا</button>
                <button class="btn" onclick="sendCommand('screenshot')">📺 لقطة شاشة</button>
                <button class="btn" onclick="sendCommand('messages')">💬 رسائل</button>
                <button class="btn" onclick="sendCommand('contacts')">📒 جهات اتصال</button>
                <button class="btn" onclick="sendCommand('location')">📍 موقع</button>
                <button class="btn" onclick="sendCommand('info')">ℹ️ معلومات</button>
                <button class="btn" onclick="sendCommand('test')">🧪 اختبار</button>
            </div>

            <div id="message" class="message"></div>

            <div style="margin-top: 40px;">
                <a href="/phone" style="color: white; text-decoration: none; background: rgba(255,255,255,0.2); padding: 15px 25px; border-radius: 10px; display: inline-block;">
                    📱 فتح صفحة الهاتف
                </a>
            </div>

            <div style="margin-top: 30px; opacity: 0.7;">
                <p>⚡ Powered by Vercel | 🤖 البوت: ناش</p>
            </div>
        </div>

        <script>
            function sendCommand(command) {
                const messageDiv = document.getElementById('message');
                const commands = {
                    'vibrate': '📳 أمر الإهتزاز',
                    'camera': '📸 فتح الكاميرا', 
                    'screenshot': '📺 لقطة الشاشة',
                    'messages': '💬 جلب الرسائل',
                    'contacts': '📒 جهات الاتصال',
                    'location': '📍 الموقع الحالي',
                    'info': 'ℹ️ معلومات الجهاز',
                    'test': '🧪 اختبار الاتصال'
                };

                messageDiv.style.display = 'block';
                messageDiv.innerHTML = `✅ <b>${commands[command]}</b> - تم المحاكاة بنجاح`;
                messageDiv.style.background = 'rgba(144, 238, 144, 0.3)';
                
                // تأثير مؤقت
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 3000);

                console.log('🔧 أمر مرسل:', command);
            }

            // إظهار رسالة ترحيب
            window.onload = function() {
                setTimeout(() => {
                    const messageDiv = document.getElementById('message');
                    messageDiv.style.display = 'block';
                    messageDiv.innerHTML = '🎉 <b>لوحة التحكم جاهزة!</b> إختر أحد الأوامر';
                    messageDiv.style.background = 'rgba(255, 255, 255, 0.2)';
                    
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 4000);
                }, 1000);
            };
        </script>
    </body>
    </html>
  `);
});

// صفحة الهاتف
app.get('/phone', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>هاتف متصل</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #00b4db, #0083b0);
                color: white;
                text-align: center;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .phone-container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                max-width: 400px;
                width: 100%;
            }
            .vibrate {
                animation: shake 0.5s;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                50% { transform: translateX(10px); }
                75% { transform: translateX(-10px); }
            }
        </style>
    </head>
    <body>
        <div class="phone-container">
            <h1>📱 هاتف متصل</h1>
            <div style="font-size: 48px; margin: 20px 0;">🟢</div>
            <p><b>متصل بلوحة التحكم</b></p>
            <p>جاهز لاستقبال الأوامر</p>
            
            <div id="commandMessage" style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 10px; display: none;">
            </div>

            <div style="margin-top: 30px;">
                <a href="/" style="color: white; text-decoration: none; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                    🔙 العودة للتحكم
                </a>
            </div>
        </div>

        <script>
            // محاكاة استقبال الأوامر
            function simulateCommand(command) {
                const messageDiv = document.getElementById('commandMessage');
                const commands = {
                    'vibrate': '📳 الهاتف يهتز!',
                    'camera': '📸 فتح الكاميرا...',
                    'screenshot': '📺 capturing screen...',
                    'messages': '💬 جلب الرسائل...',
                    'test': '🧪 اختبار الاتصال ✓'
                };

                messageDiv.style.display = 'block';
                messageDiv.innerHTML = `<b>${commands[command]}</b>`;
                
                if (command === 'vibrate') {
                    document.body.classList.add('vibrate');
                    if (navigator.vibrate) {
                        navigator.vibrate([500, 200, 500]);
                    }
                    setTimeout(() => {
                        document.body.classList.remove('vibrate');
                    }, 1000);
                }

                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 3000);
            }

            // محاكاة أوامر عشوائية كل 10 ثواني
            setInterval(() => {
                if (Math.random() > 0.8) {
                    const commandList = ['vibrate', 'camera', 'screenshot', 'test'];
                    const randomCommand = commandList[Math.floor(Math.random() * commandList.length)];
                    simulateCommand(randomCommand);
                }
            }, 10000);

            console.log('📱 الهاتف جاهز للاتصال');
        </script>
    </body>
    </html>
  `);
});

// صفحة الويب هوك
app.post('/webhook', (req, res) => {
  console.log('📩 Webhook received');
  res.json({ 
    status: 'success',
    message: 'Webhook is working',
    timestamp: new Date().toISOString()
  });
});

app.get('/webhook', (req, res) => {
  res.json({ 
    status: 'active',
    url: 'https://hamza-lac-three.vercel.app/webhook',
    method: 'POST'
  });
});

// صفحة الحالة
app.get('/status', (req, res) => {
  res.json({
    status: '🟢 Online',
    server: 'Vercel',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// صفحة 404
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - الصفحة غير موجودة</h1>
    <p><a href="/">العودة للرئيسية</a></p>
  `);
});

// لا نستخدم app.listen في Vercel
module.exports = app;
