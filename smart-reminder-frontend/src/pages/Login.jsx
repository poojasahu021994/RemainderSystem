// import { useState } from "react"
// import axios from "axios"
// import { useNavigate } from "react-router-dom"

// export default function Login(){

// const [username,setUsername]=useState("")
// const [password,setPassword]=useState("")
// const navigate = useNavigate()

// const handleLogin = async () =>{

//       console.log("Sending:", username, password)

//   if (!username || !password) {
//     alert("Please fill all fields")
//     return
//   }

// try{

// const res = await axios.post(
// "https://remainderssystem.onrender.com/api/login/",
// {username,password}
// )
// console.log("SUCCESS:", res.data)
// localStorage.setItem("token",res.data.access)

// navigate("/dashboard")

// }catch (err) {

//     console.log("FULL ERROR OBJECT:", err)

//     if (err.response) {
//       console.log("BACKEND DATA:", err.response.data)
//       alert(JSON.stringify(err.response.data))
//     } else if (err.request) {
//       console.log("NO RESPONSE RECEIVED:", err.request)
//       alert("Server not responding")
//     } else {
//       console.log("ERROR MESSAGE:", err.message)
//       alert(err.message)
//     }
//   }
// }

// return(

// <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-300">

// <div className="bg-white w-96 p-8 rounded-2xl shadow-xl">

// <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
// Smart Reminder
// </h1>

// <input
// type="text"
// placeholder="Username"
// value={username}
// onChange={(e)=>setUsername(e.target.value)}
// className="w-full p-3 border rounded-lg mb-4"
// />

// <input
// type="password"
// placeholder="Password"
// value={password}
// onChange={(e)=>setPassword(e.target.value)}
// className="w-full p-3 border rounded-lg mb-4"
// />

// <button
// onClick={handleLogin}
// className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600"
// >
// Login
// </button>

// <p className="text-center mt-5 text-sm">
// Don't have account?
// <span
// onClick={()=>navigate("/register")}
// className="text-indigo-600 ml-1 cursor-pointer"
// >
// Register
// </span>
// </p>

// </div>

// </div>

// )

// }
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login(){

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const navigate = useNavigate()

const handleLogin = async () =>{

try{

const res = await axios.post(
"https://remainderssystem.onrender.com/api/login/",
{username,password}
)

localStorage.setItem("token",res.data.access)

navigate("/dashboard")

}catch{

alert("Invalid Credentials")

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-300">

<div className="bg-white w-96 p-8 rounded-2xl shadow-xl">

<h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
Smart Reminder
</h1>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<button
onClick={handleLogin}
className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600"
>
Login
</button>

<p className="text-center mt-5 text-sm">
Don't have account?
<span
onClick={()=>navigate("/register")}
className="text-indigo-600 ml-1 cursor-pointer"
>
Register
</span>
</p>

</div>

</div>

)

}