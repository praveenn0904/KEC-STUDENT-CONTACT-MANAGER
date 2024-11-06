// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import Register from './Register';
import { useNavigate } from 'react-router-dom';
import './style.css';
const Login = () => {
    const[toggle,setToggle]=useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/students');
            // Here you would typically save the token to local storage or context
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Login failed.');
        }
    };

    return (
        <div className='login'>
        {!toggle?<div>
            <h1>Student contact manager Login</h1>
            <br></br>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <button onClick={()=>setToggle(prev=>!prev)}>New user? click to create account </button>
            </form>
            {message && <p>{message}</p>}
        </div>:<Register setToggle={setToggle}/>}
        </div>
        
    );
};

export default Login;
