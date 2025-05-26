import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import LeaveBalance from '../component/LeaveBalance';

interface Vacation {
    vacation_id: number;
    title: string;
    start_date: string;
    end_date: string;
   
  }
  
  

export default function UserInfoPage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if(!user){
        return <Navigate to ='/users/login' />;
    }
    const [vacations, setVacations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [leaveType, setLeaveType] = useState('Annual');

    const fetchData = async () => {
        const res = await axios.get(`http://localhost:3001/api/vacations/user/${user.user_id}`);
        setVacations(res.data);
      };

    useEffect(() =>{
        
        if(!user.user_id) return;

        axios.get(`http://localhost:3001/api/vacations/user/${user.user_id}`)
             .then((res) => {
                setVacations(res.data);
             }).catch((err) => {
                console.error('휴가조회 실패', err);
             });
    }, []);
    
    //휴가등록
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            user_id: user.user_id,
            name: user.user_name,
            title: leaveType || "휴가",
            start_date: startDate,
            end_date: endDate,
            leave_type: leaveType
        };
        try {
            await axios.post('http://localhost:3001/api/vacations', payload); 
            alert('휴가 등록 완료');
            setReason('');
            setStartDate('');
            setEndDate('');
            setLeaveType('');
            const res = await axios.get(`http://localhost:3001/api/vacations/user/${user.user_id}`);
            setVacations(res.data);
            await fetchData();

        } catch (err) {
            alert('등록실패')
            await fetchData();
        }
       
    };

    //휴가삭제
    const handleDelete = async(vacationId: number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:3001/api/vacations/${vacationId}`);
            setVacations(prev => prev.filter(v => v.vacation_id !== vacationId));
            alert('삭제성공');
        } catch (error) {
            alert("삭제실패");
        }
    }


    return (
       
        <div style = {{ padding: '20px'}}>
            <h2>INFO</h2>
            <p><strong>아이디 : </strong>{user.user_id}</p>
            <p><strong>이름 : </strong>{user.user_name}</p>
            <LeaveBalance />
            <form onSubmit={handleSubmit}>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                    <option value = "Annual">연차</option>
                    <option value = "Half">반차</option>
                    <option value = "Sick">병가</option>
                </select><br></br><br></br>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /><br></br><br></br>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /><br></br><br></br>
                <input type="text" placeholder="사유" value={reason} onChange={(e) => setReason(e.target.value)} /><br></br><br></br>
                <button type='submit'>휴가 등록</button>
            </form>
            <br></br>
        
            <h3>나의 휴가 내역</h3>
            {vacations.length === 0 ? (
                <p>등록된 휴가가 없습니다.</p>
            ): (
                <ul>
                {vacations.map((v: any) => {
                  let typeLabel = '기타';
                  if (v.leave_type === 'Half') typeLabel = '반차';
                  else if (v.leave_type === 'Annual') typeLabel = '연차';
                  else if (v.leave_type === 'Sick') typeLabel = '병가';
              
                  return (
                    <li key={v.vacation_id}>
                      {v.start_date} ~ {v.end_date} / 종류: {typeLabel}
                      <button onClick={() => handleDelete(v.vacation_id)}>삭제</button>
                    </li>
                  );
                })}
              </ul>
            )}
       </div>
        
    );
    
}
