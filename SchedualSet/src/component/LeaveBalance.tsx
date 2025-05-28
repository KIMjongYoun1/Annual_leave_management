import { useEffect, useState } from 'react';
import axios from 'axios';



export default function LeaveBalance() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        return <p>유저정보가 없습니다.</p>;
    }

    const user =  storedUser ? JSON.parse(storedUser) : null;
    const userid = user.user_id;

    const [leave, setLeave] = useState({ earned: 0, used: 0, remaining: 0});

    useEffect(() => {
        if (!userid) return;

        axios.get(`http://localhost:3001/api/leave/${userid}`)
            .then(res => setLeave(res.data))
            .catch(err => console.error('휴가정보 불러오기 실패', err)); 
    }, [userid]);
    return (
        <div>
            <h3>Vacations</h3>
            <p>Earned_Vacation: {leave.earned}</p>
            <p>use_Vacation: {leave.used}</p>
            <p><strong>Have_Vacation: {leave.remaining}</strong></p>
        </div>
    );
}