import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register(){

const [name,setName] = useState("")
const [username,setUsername] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")

const navigate = useNavigate()

const handleRegister = async () => {

if(password !== confirmPassword){
alert("Passwords do not match")
return
}

try{

await axios.post(
"https://remainderssystem.onrender.com/api/register/",
{
name,
username,
email,
password
}
)

alert("Account Created Successfully")

navigate("/")

}catch{

alert("Registration Failed")

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-300">

<div className="bg-white w-[420px] p-8 rounded-2xl shadow-xl">

<h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
Create Account
</h1>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<input
type="email"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full p-3 border rounded-lg mb-4"
/>

<button
onClick={handleRegister}
className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600"
>
Register
</button>

<p className="text-center mt-5 text-sm">
Already have an account?
<span
onClick={()=>navigate("/")}
className="text-indigo-600 ml-1 cursor-pointer"
>
Login
</span>
</p>

</div>

</div>

)

}