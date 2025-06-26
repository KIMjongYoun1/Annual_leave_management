import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute ({children}: ProtectedRouteProps){
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user){
        alert('로그인이 필요합니다');
        return <Navigate to="/users/login" replace />;
    }

    return children;
}