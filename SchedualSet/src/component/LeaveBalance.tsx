import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeaveBalance() {
    const user = JSON.parse(localStorage.getItem('user' || '{}'));
    const [leave, setLeave] = useState({ earned: 0, used: 0, remaining: 0});

    useEffect(() => {
        axios.get(`http://localhost:3001/api/leave/${user.user_id}`)
            .then(res => setLeave(res.data)),
            .catch(err => console.error('휴가정보 불러오기 실패', err));
           
    }, []);
    return (
        <div>
            <h3>Vacations</h3>
            <p>Earned_Vacation: {leave.earned}</p>
            <p>use_Vacation: {leave.used}</p>
            <p><strong>Have_Vacation: {leave.remaining}</strong></p>
        </div>
    );
}