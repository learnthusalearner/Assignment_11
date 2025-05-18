const express = require('express');
const bodyParser = require('body-parser');
const { sendEmail } = require('./services/emailService');
const { sendSMS } = require('./services/smsService');
const { sendInApp, getUserNotifications } = require('./services/inAppService');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());


app.post('/notifications', async (req, res) => {
  const { type, userId, to, subject, message } = req.body;

  if (!type || !message) {
    return res.status(400).json({ error: 'Type and message are required.' });
  }

  try {
    switch (type.toLowerCase()) {
      case 'email':
        await sendEmail({ to, subject, message });
        break;
      case 'sms':
        await sendSMS({ to, message });
        break;
      case 'in-app':
        sendInApp({ userId, message });
        break;
      default:
        return res.status(400).json({ error: 'Invalid notification type.' });
    }

    res.json({ success: true, message: `${type} notification sent.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});


app.get('/users/:id/notifications', (req, res) => {
  const userId = req.params.id;
  const notifications = getUserNotifications(userId);
  res.json({ userId, notifications });
});

app.listen(5000,()=>{
    console.log("started");
})
