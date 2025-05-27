import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginPage() {
    const [userid, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

     //  로그인된 유저가 접근 시 차단
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      alert('이미 로그인되어 있습니다.');
      navigate('/calendar'); 
      console.log(localStorage);
    }
  }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const res = await axios.post('http://localhost:3001/api/users/login', {
                userid,
                password
            });
            localStorage.setItem('user',JSON.stringify(res.data.user));
            alert(res.data.message);
            navigate('/calendar');
        } catch (err :any) {
            alert(err.reasponse ?.data.message);
        }
        
    };

return (
    <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input type="text" placeholder='ID'
        value={userid} onChange={(e) => setUserId(e.target.value)} />
        <br></br>
        <input type="password" placeholder='PASSWORD'
        value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
    </form>
)
}