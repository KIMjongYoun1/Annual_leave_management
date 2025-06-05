import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Award {
    award_id: number;
    user_id: string;
    title: string;
    award_date: string;
    description: string;
}

interface AwardComponentProps {
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

export default function AwardComponent({viewedUserId, currentUser}: AwardComponentProps) {
   
    const [awards, setAwards] = useState<Award[]>([]);
    const [newAward, setNewAward] = useState({ title: '', description: '', award_date: '' });
    const [editAwardId, setEditAwardId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ title: '', description: '', award_date: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/awards/${viewedUserId}`);
            setAwards(res.data);
        } catch (err) {
            console.error('수상 이력 조회 실패', err);
        }
    };

    const handleAdd = async () => {
        if (!newAward.title || !newAward.award_date) {
            alert('제목과 날짜는 필수 입니다.');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/awards', {
                ...newAward, user_id: viewedUserId
            });
            setNewAward({ title: '', description: '', award_date: '' });
            setShowAddForm(false);
            fetchAwards();
        } catch (err) {
            console.error('추가실패', err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/awards/${id}`);
            fetchAwards();
        } catch (err) {
            console.error('삭제 실패', err);
        }
    };

    const handleEdit = (award: Award) => {
        setEditAwardId(award.award_id);
        setEditData({
            title: award.title,
            description: award.description,
            award_date: award.award_date
        });
    };

    const handleUpdate = async (id: number) => {
        try {
            await axios.put(`http://localhost:3001/api/awards/${id}`, editData);
            setEditAwardId(null);
            fetchAwards();
        } catch (err) {
            console.error('수정 실패', err);
        }
    };

    return (
        <div style={boxStyle}>
            <h3>수상 이력</h3>
            <table style={{ width: '100%', fontSize: '14px' }} >
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>설명</th>
                        <th>날짜</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {awards.map((award) => (
                        <tr key={award.award_id}>
                            {editAwardId === award.award_id ? (
                                <>
                                    <td><input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} /></td>
                                    <td><input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>
                                    <td><input type="date" value={editData.award_date} onChange={(e) => setEditData({ ...editData, award_date: e.target.value })} /></td>
                                    <td>
                                        <button onClick={() => handleUpdate(award.award_id)}>저장</button>
                                        <button onClick={() => setEditAwardId(null)}>취소</button>
                                    </td>
                                </>) : (
                                <>
                                    <td>{award.title}</td>
                                    <td>{award.description}</td>
                                    <td>{award.award_date}</td>
                                    {(currentUser.user_id === award.user_id || currentUser.role === 'Admin') && (
                                        <>
                                            <button onClick={() => handleEdit(award)}>수정</button>
                                            <button onClick={() => handleDelete(award.award_id)}>삭제</button>
                                        </>
                                    )}
                                </>

                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            { /* 입력폼 */}
            <button onClick={()=> setShowAddForm(true)}>추가</button>
            {showAddForm &&(
            (currentUser.user_id === viewedUserId || currentUser.role === 'Admin') && (
                <div style={{ marginTop: '10px' }}>
                    <input
                        placeholder='제목'
                        value={newAward.title}
                        onChange={(e) => setNewAward({ ...newAward, title: e.target.value })} />
                    <br />
                    <input
                        placeholder='설명'
                        value={newAward.description}
                        onChange={(e) => setNewAward({ ...newAward, description: e.target.value })} />
                    <br />
                    <input
                        type="date"
                        value={newAward.award_date}
                        onChange={(e) => setNewAward({ ...newAward, award_date: e.target.value })} />
                    <br />
                    <button onClick={handleAdd}>추가</button>
                    <button onClick={() => setShowAddForm(false)}>취소</button>
                </div>
            ))}
        </div>
    );
}