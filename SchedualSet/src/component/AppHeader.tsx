import { Link, useNavigate } from 'react-router-dom';


export default function AppHeader() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        alert('로그아웃 되었습니다');
        navigate('/calendar');
    };

    return (
        <header style = {{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#6a1b9a', // 보라색 (Material 색상 계열)
            color: 'white',             // 글자색 흰색
            borderBottom: '2px solid #4a148c'
        }}>
             <div>
    <Link to="/calendar" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>📅 Home</Link>
    <Link to="/user/info" style={{ color: 'white', textDecoration: 'none' }}>👤 My Page</Link>
  </div>
  <div>
    {user ? (
      <>
        <span style={{ marginRight: '10px' }}>{user.user_name} 님</span>
        <button onClick={handleLogout} style={{ backgroundColor: 'white', color: '#6a1b9a', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>로그아웃</button>
      </>
    ) : (
      <>
        <Link to="/users/login" style={{ marginRight: '10px', color: 'white' }}>로그인</Link>
        <Link to="/users/register" style={{ color: 'white' }}>회원가입</Link>
      </>
    )}
  </div>


        </header>
    )
}

