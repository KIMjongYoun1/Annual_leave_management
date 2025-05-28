// 휴가등록 컴포넌트 초안
import { useState } from 'react'; //중복선언
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export default function VacationForm(){
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [reason, setReason] = useState('');
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const [leaveType, setLeaveType] = useState('Annual');

    if (!user) {
        return <Navigate to ="/users/login" />
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startDate && endDate && endDate < startDate) {
            alert("종료일은 시작일보다 빠를 수 없습니다.");
            return;
        }

        //여기서 Axios 등으로 API호출
        const payload = {
            user_id : user.user_id, // 로그인구현전까지
                name: user.user_name,
                leave_type: reason || leaveType,
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                title: reason?.trim() || leaveType 
                
        };
        
        try {
            
           await axios.post('http://localhost:3001/api/vacations', payload); 
            console.log('📦 전달된 값:', payload);
            alert('휴가 등록 완료!');
            navigate('/user/info');

        } catch (err: any) {
            console.log("🧨 오류 응답:", err.response);
        
            if (err.response?.status === 400) {
                alert(err.response.data.message); // "잔여 연차 부족"
            } else {
                alert('등록 실패');
            }
        }
        console.log({startDate, endDate, reason});
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
            <h3>{user!.user_name} 님의 휴가 등록</h3>
            </div>
            <div>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                    <option value = "Annual">연차</option>
                    <option value = "Half">반차</option>
                    <option value = "Sick">병가</option>
                </select>
            </div>
            <div>
                <label>시작일 : </label>
                <DatePicker selected={startDate} onChange={(date) =>setStartDate(date) } />   
            </div>
            <div>
                <label>종료일 : </label>
                <DatePicker selected={endDate} onChange={(date)=>setEndDate(date)} />
            </div>   
            <div>
                <label>사유 : </label>
                <input type="text" value={reason} onChange={(e)  =>setReason(e.target.value)} />
            </div> 
            <button type="submit">휴가 등록</button>
        </form>
    );

    function formatDate(date: Date | null): string | null {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // JS는 0부터 시작
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // ✅ KST 기준 YYYY-MM-DD
      }

}