import { useEffect } from "react";
import axios from "axios";

function NotificationPage() {

  useEffect(() => {

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          "https://remainderssystem.onrender.com/api/reminders/notifications/",
          {
            headers: {
              Authorization: `Bearer YOUR_TOKEN`
            }
          }
        );

        if (res.data.length > 0) {
          res.data.forEach(reminder => {
            alert("🔔 " + reminder.title);
          });
        }

      } catch (err) {
        console.log(err);
      }
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return <h2>Notification Page</h2>;
}

export default NotificationPage;