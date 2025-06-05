import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Career {
    career_id: number;
    user_id: string;
    company_name: string;
    position: string
    start_date: string;
    end_date: string;
    description: string;
}

interface CareerComponentProps {
    viewedUserId: string;
    currentUser: {
        user_id: string;
        role: string;
    };
}

const boxStyle: React.CSSProperties = {
    flex: 1,
    height: '230px',
    minWidth: '200px',
    border: '1px solid #ccc',
    padding: '5px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflowY: 'auto'
};

export default function CareerComponent({ viewedUserId, currentUser }: CareerComponentProps) {

    const [careers, setCareers] = useState<Career[]>([]);
    const [newCareer, setNewCareer] = useState({ company_name: '', description: '', start_date: '', end_date: '', position: '' });
    const [editCareerId, setEditCareerId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ company_name: '', description: '', start_date: '', end_date: '', position: '' });
    const [showAddForm, setShowAddForm] = useState(false);


    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/careers/${viewedUserId}`);
            setCareers(res.data);
        } catch (err) {
            console.error('수상 이력 조회 실패', err);
        }
    };

    const handleAdd = async () => {
        if (!newCareer.company_name || !newCareer.start_date || !newCareer.end_date) {
            alert('제목과 날짜는 필수 입니다.');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/careers', {
                ...newCareer, user_id: viewedUserId
            });
            setNewCareer({ company_name: '', description: '', start_date: '', end_date: '', position: '' });
            setShowAddForm(false);
            fetchCareers();
        } catch (err) {
            console.error('추가실패', err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/careers/${id}`);
            fetchCareers();
        } catch (err) {
            console.error('삭제 실패', err);
        }
    };

    const handleEdit = (career: Career) => {
        setEditCareerId(career.career_id);
        setEditData({
            company_name: career.company_name,
            position: career.position,
            start_date: career.start_date,
            end_date: career.end_date,
            description: career.description
        });
    };

    const handleUpdate = async (id: number) => {
        try {
            await axios.put(`http://localhost:3001/api/careers/${id}`, editData);
            setEditCareerId(null);
            fetchCareers();
        } catch (err) {
            console.error('수정 실패', err);
        }
    };

    return (
        <div style={boxStyle}>
            <h3>경력</h3>
            <table style={{ width: '100%', fontSize: '14px' }} >
                <thead>
                    <tr>
                        <th>회사 명</th>
                        <th>직책</th>
                        <th>입사일</th>
                        <th>퇴사일</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {careers.map((career) => (
                        <tr key={career.career_id}>
                            {editCareerId === career.career_id ? (
                                <>
                                    <td><input value={editData.company_name} onChange={(e) => setEditData({ ...editData, company_name: e.target.value })} /></td>
                                    <td><input value={editData.position} onChange={(e) => setEditData({ ...editData, position: e.target.value })} /></td>
                                    <td><input type="date" value={editData.start_date} onChange={(e) => setEditData({ ...editData, start_date: e.target.value })} /></td>
                                    <td><input type="date" value={editData.end_date} onChange={(e) => setEditData({ ...editData, end_date: e.target.value })} /></td>
                                    <td><input type="date" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>

                                    <td>
                                        <button onClick={() => handleUpdate(career.career_id)}>저장</button>
                                        <button onClick={() => setEditCareerId(null)}>취소</button>
                                    </td>
                                </>) : (
                                <>
                                    <td>{career.company_name}</td>
                                    <td>{career.position}</td>
                                    <td>{career.start_date}</td>
                                    <td>{career.end_date}</td>
                                    <td>{career.description}</td>
                                    {(currentUser.user_id === career.user_id || currentUser.role === 'Admin') && (
                                        <>
                                            <button onClick={() => handleEdit(career)}>수정</button>
                                            <button onClick={() => handleDelete(career.career_id)}>삭제</button>
                                        </>
                                    )}
                                </>

                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            { /* 입력폼 */}
            <button onClick={() => setShowAddForm(true)}>추가</button>
            {showAddForm && (
                (currentUser.user_id === viewedUserId || currentUser.role === 'Admin') && (
                    <div style={{ marginTop: '10px' }}>
                        <input
                            placeholder='회사이름'
                            value={newCareer.company_name}
                            onChange={(e) => setNewCareer({ ...newCareer, company_name: e.target.value })} />
                        <br />
                        <input
                            placeholder='직책'
                            value={newCareer.position}
                            onChange={(e) => setNewCareer({ ...newCareer, position: e.target.value })} />
                        <br />
                        <input
                            type="date"
                            value={newCareer.start_date}
                            onChange={(e) => setNewCareer({ ...newCareer, start_date: e.target.value })} />
                        <br />
                        <input
                            type="date"
                            value={newCareer.end_date}
                            onChange={(e) => setNewCareer({ ...newCareer, end_date: e.target.value })} />
                        <br />
                        <input
                            type="text"
                            value={newCareer.description}
                            onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })} />
                        <br />
                        <button onClick={handleAdd}>추가</button>
                        <button onClick={() => setShowAddForm(false)}>취소</button>

                    </div>
                )
        )}
        </div>
    );
}