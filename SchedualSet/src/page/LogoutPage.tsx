import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage(){
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
        alert('로그아웃 되었습니다.');
        navigate('/calendar');
    }, []);
    return null;
}