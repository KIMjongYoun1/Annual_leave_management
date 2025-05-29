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
        <div style={boxStyle}>
            <h3 style={{ marginBottom: '8px', fontSize: '12px'}}>연차 정보</h3>
            <p><strong>발생 연차:</strong> {leave.earned}일</p>
            <p><strong>사용 연차:</strong> {leave.used}일</p>
            <p><strong>잔여 연차:</strong> <strong>{leave.remaining}일</strong></p>
        </div>
    );
    
}

const boxStyle: React.CSSProperties = {
    flex: 1,
    height: '230px',
    minWidth: '200px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
};