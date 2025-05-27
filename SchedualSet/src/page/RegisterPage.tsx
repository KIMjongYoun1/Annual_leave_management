import { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
    const [userid, setUserId] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartMent] = useState('');
    const [position, setPosition] = useState('');


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/users/register', {
                userid,
                username,
                password,
                department,
                position
            });
            alert('가입완료');
        } catch (err) {
            alert('가입실패');
        }
    };

return (
    <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input type='text' placeholder='ID'
        value={userid}
        onChange={(e) => setUserId(e.target.value)}/>
        <br></br><br></br>
        <input type='text' placeholder='Name'
        value={username}
        onChange={(e) => setUserName(e.target.value)} />
        <br></br><br></br>
        <input type='password' placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}/>
        <br></br><br></br>
        <input type ="text" placeholder='부서' value={department} onChange={(e) => setDepartMent(e.target.value)} />
        <br></br><br></br>
        <input type = "text" placeholder='직급' value={position} onChange={(e) => setPosition(e.target.value)}/>
        <br></br>
        <button type='submit'>Register Right Now!</button>
    </form>
    );
}