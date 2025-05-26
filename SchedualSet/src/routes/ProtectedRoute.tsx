import { Navigate } from 'react-router-dom';


interface ProtectedRoutProps {
    children: JSX.Element;
}

export default function ProtectedRoute ({children}: ProtectedRoutProps){
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user){
        alert('로그인이 필요합니다');
        return <Navigate to="/users/login" />;
    }

    return children;
}