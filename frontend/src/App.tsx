import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Types ---
interface Notification {
  message: string;
  timestamp: string;
}
type NotificationType = 'email' | 'sms' | 'in-app';

// --- Props for the form component ---
interface NotificationFormProps {
  onSend: (payload: Record<string, any>) => Promise<void>;
}

/**
 * A simple form where you choose a type and write a message.
 * I tried to make it work, hope it doesn't break.
 */
const NotificationForm: React.FC<NotificationFormProps> = ({ onSend }) => {
  const [type, setType] = useState<NotificationType>('email');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendNotification = async () => {
    if (!body.trim()) {
      window.alert('Oops, the message is empty. I think I need to write something.');
      return;
    }

    setIsSending(true);

    const payload: any = { type, message: body };
    if (type === 'email' || type === 'sms') payload.to = recipient;
    if (type === 'email') payload.subject = subject;
    if (type === 'in-app') payload.userId = userId;

    try {
      await onSend(payload);
      window.alert('I think it sent. I hope it worked.');
      // Clear fields that were used
      setBody('');
      if (type !== 'in-app') setRecipient('');
      if (type === 'email') setSubject('');
      if (type === 'in-app') setUserId('');
    } catch {
      window.alert('Sorry, something went wrong. Maybe try again?');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <label className="block text-sm">Select notification type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as NotificationType)}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="in-app">In-App</option>
        </select>
      </div>

      {(type === 'email' || type === 'sms') && (
        <div>
          <label className="block text-sm">Recipient</label>
          <input
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder={type === 'email' ? 'someone@example.com' : '1234567890'}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
      )}

      {type === 'email' && (
        <div>
          <label className="block text-sm">Subject</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="About something"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
      )}

      {type === 'in-app' && (
        <div>
          <label className="block text-sm">User ID</label>
          <input
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="user-id"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
      )}

      <div>
        <label className="block text-sm">Message</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Type your message"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <button
        onClick={sendNotification}
        disabled={isSending}
        className={`w-full py-2 rounded text-white font-semibold ${
          isSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </section>
  );
};

// --- Notifications List ---
interface NotificationsListProps {
  notifications: Notification[];
}

/**
 * Shows fetched notifications, I hope it looks okay.
 */
const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  if (!notifications.length) return <p>No messages right now.</p>;

  return (
    <ul className="bg-gray-50 border rounded p-4 space-y-2 max-h-60 overflow-auto">
      {notifications.map((n, i) => (
        <li key={i} className="text-sm flex justify-between">
          <span>{n.message}</span>
          <time dateTime={n.timestamp} className="text-xs text-gray-500">
            {new Date(n.timestamp).toLocaleString()}
          </time>
        </li>
      ))}
    </ul>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewingUser, setViewingUser] = useState('');

  const sendNotification = async (payload: Record<string, any>) => {
    await axios.post('http://localhost:5000/notifications', payload);
  };

  useEffect(() => {
    if (!viewingUser) return;
    axios
      .get<{ notifications: Notification[] }>(
        `http://localhost:5000/users/${viewingUser}/notifications`
      )
      .then(res => setNotifications(res.data.notifications))
      .catch(() => window.alert('Could not load messages. Sorry.'));
  }, [viewingUser]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow rounded p-8 space-y-8">
        <h1 className="text-2xl font-bold text-center">Notification Center</h1>

        <NotificationForm onSend={sendNotification} />

        <hr className="border-gray-200" />

        <section className="space-y-4">
          <div className="flex gap-2">
            <input
              placeholder="Enter user ID"
              value={viewingUser}
              onChange={e => setViewingUser(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => { /* useEffect will fetch */ }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Refresh
            </button>
          </div>

          <NotificationsList notifications={notifications} />
        </section>
      </div>
    </main>
  );
};

export default App;
