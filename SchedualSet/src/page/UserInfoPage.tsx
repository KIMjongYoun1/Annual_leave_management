import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserProfile from '../component/Users/UserProfile';
import LeaveBalance from '../component/Vacations/LeaveBalance';
import VacationForm from '../component/Vacations/VacationForm';
import VacationList from '../component/Vacations/VacationList';
import UserProfileEdit from '../component/Users/UserProfileEdit';
import axios from 'axios';

export default function UserInfoPage() {
    const [activeTab, setActiveTab] = useState<'info' | 'vacation'>('info');
    const [editMode, setEditMode] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setReFresh] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        const user = raw ? JSON.parse(raw) : null;

        if (user?.user_id) {
            axios.get(`http://localhost:3001/api/users/${user.user_id}`)
                .then((res) => setUserInfo(res.data))
                .catch((err) => console.error('유저 조회 실패', err))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) return <div>로딩중...</div>

    if (!userInfo || !userInfo.user_id) return <Navigate to='/users/login' />;


    return (
        <div style={{ padding: '20px' }}>
            <h2>INFO</h2>

            {/* 탭 메뉴 */}
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('info')}>상세정보</button>
                <button onClick={() => setActiveTab('vacation')}>휴가신청</button>
            </div>

            {/* 탭 내용 */}
            {activeTab === 'info' && (
                <>
                    {!editMode ? (
                        <>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <UserProfile userInfo={userInfo} />
                                <LeaveBalance userid={userInfo.user_id} />
                            </div>
                            <button onClick={() => setEditMode(true)}>프로필 수정</button>
                        </>
                    ) : (
                        <UserProfileEdit user={userInfo} onCancel={() => setEditMode(false)} />
                    )}

                    {/* (향후) 수상/경력 추가 예정 */}
                </>
            )}

            {activeTab === 'vacation' && (
                <>

                    <VacationForm userId={userInfo.user_id} userName={userInfo.user_name}
                        onSuccess={() => setReFresh(prev => !prev)} />
                    <VacationList userId={userInfo.user_id} refresh={refresh} />
                </>
               
    )
}
        </div >
    );
}
