import './App.css'
import axios from "axios";
import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react';

function App() {
  const [token,setToken] = useState("");

  return (
    <>
      <p>Username</p>
     <input></input>
     <br></br>
     <p>Password</p>
     <input></input>
     <Turnstile onSuccess={(token) => {
        setToken(token)
      }} siteKey='0x4AAAAAAAb-f-VEUQ0lwkFO' />
      <button onClick={() => {
        axios.post("http://localhost:3000/reset-password", {
          email: "omsureja@gmail.com",
          otp: "634620",
          newPassword:"1234567",
          token: token,
        })
      }}>Update password</button>
    </>
  )
}

export default App
