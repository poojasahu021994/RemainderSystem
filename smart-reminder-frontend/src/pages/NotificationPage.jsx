import { useEffect, useState, useRef } from "react";
import axios from "axios";

function NotificationPage() {

  const [notifications, setNotifications] = useState([]);
  const shownIds = useRef(new Set());

  useEffect(() => {

    const token = localStorage.getItem("token");

    console.log("Component mounted");

    const interval = setInterval(async () => {

      console.log("Checking notifications...");

      try {
        const res = await axios.get(
          "https://remainderssystem.onrender.com/api/reminders/notifications/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("API DATA:", res.data);

        res.data.forEach((reminder) => {

          if (!shownIds.current.has(reminder.id)) {

            setNotifications(prev => [reminder, ...prev]);
            shownIds.current.add(reminder.id);

            console.log("New Notification:", reminder.title);

            //  SOUND ALERT (optional)
            const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-01a.mp3");
            audio.play().catch(() => {});
          }
        });

      } catch (err) {
        console.log("Notification error:", err);
      }

    }, 15000); // 15 sec

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-3 rounded shadow"
        >
          <p className="font-bold text-gray-800">{n.title}</p>

          <p className="text-sm text-gray-600">
            {new Date(n.reminder_time).toLocaleString()}
          </p>

          <p className="text-xs mt-1 text-blue-600">
            {n.repeat_daily ? "Daily Reminder" : "One-Time Reminder"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default NotificationPage;