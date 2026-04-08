import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {

    const [title, setTitle] = useState("")
    const [datetime, setDatetime] = useState("")
    const [reminders, setReminders] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [repeatDaily, setRepeatDaily] = useState(false)
    const [audioId, setAudioId] = useState(1)

    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    // 🔐 Logout
    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    // 📥 Fetch reminders
    const fetchReminders = async () => {
        try {
            const res = await axios.get(
                "https://remainderssystem.onrender.com/api/reminders/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setReminders(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReminders()
    }, [])

    // ➕ Create reminder
    const handleCreateReminder = async () => {
        console.log("Repeat value:", repeatDaily)

        try {
            await axios.post(
                "https://remainderssystem.onrender.com/api/reminders/",
                {
                    title: title,
                    reminder_time: datetime,
                    repeat_daily: repeatDaily
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Reminder Created ✅")

            setTitle("")
            setDatetime("")
            setEditingId(null)

            fetchReminders()

        } catch (error) {
            console.log(error)
            alert("Create Failed ❌")
        }
    }

    // ✏ Update reminder
    const handleUpdateReminder = async () => {
        try {
            await axios.put(
                `https://remainderssystem.onrender.com/api/reminders/${editingId}/`,
                {
                    title: title,
                    reminder_time: datetime,
                    repeat_daily: repeatDaily
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Reminder Updated ✅")

            setEditingId(null)
            setTitle("")
            setDatetime("")

            fetchReminders()

        } catch (error) {
            console.log(error)
            alert("Update Failed ❌")
        }
    }

    // 🗑 Delete reminder
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `https://remainderssystem.onrender.com/api/reminders/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            fetchReminders()

        } catch (error) {
            console.log(error)
            alert("Delete Failed ❌")
        }
    }


    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">
                        Smart Reminderrrr
                    </h2>
 <div className="flex gap-2">
        <button
            onClick={() => navigate("/notificationPage")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
            Notifications 🔔
        </button>

        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
            Logout
        </button>
    </div>
                    {/* <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button> */}
                </div>

                {/* Form */}
                <div className="bg-gray-50 p-6 rounded-xl shadow mb-8">

                    <input
                        type="text"
                        placeholder="Reminder Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <input
                        type="datetime-local"
                        value={datetime}
                        onChange={(e) => setDatetime(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={repeatDaily}
                            onChange={(e) => setRepeatDaily(e.target.checked)}
                        />
                        <label className="text-gray-700">Repeat Daily</label>
                    </div>

                    {editingId ? (
                        <button
                            onClick={handleUpdateReminder}
                            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition"
                        >
                            Update Reminder
                        </button>
                    ) : (
                        <button
                            onClick={handleCreateReminder}
                            className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition"
                        >
                            Create Reminder
                        </button>
                    )}
                </div>

                {/* List */}
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Your Reminders
                </h3>

                <div className="grid gap-4">

                    {reminders.length === 0 && (
                        <p className="text-gray-500">No reminders yet</p>
                    )}

                    {reminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className="bg-white border shadow-md rounded-xl p-4 flex justify-between items-center hover:shadow-lg transition"
                        >
                            <div>
                                <p className="font-bold text-gray-800">
                                    {reminder.title}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {new Date(reminder.reminder_time).toLocaleString()}
                                </p>

                                <p className="text-sm mt-1">
                                    Status:
                                    <span
                                        className={
                                            reminder.is_triggered
                                                ? "text-green-600 font-semibold ml-1"
                                                : "text-orange-500 font-semibold ml-1"
                                        }
                                    >
                                        {reminder.is_triggered ? "Triggered" : "Pending"}
                                    </span>
                                </p>

                                <p className="text-sm mt-1">
                                    Repeat:
                                    <span className={`px-2 py-1 text-xs rounded-full ${reminder.repeat_daily
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-200 text-gray-700"
                                        }`}>
                                        {reminder.repeat_daily ? "Daily" : "One-Time"}
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => handleDelete(reminder.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingId(reminder.id)
                                        setTitle(reminder.title)
                                        setDatetime(reminder.reminder_time.slice(0, 16))
                                    }}
                                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                                >
                                    Edit
                                </button>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}