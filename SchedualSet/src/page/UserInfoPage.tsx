import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserProfile from '../component/Users/UserProfile';
import LeaveBalance from '../component/Vacations/LeaveBalance';
import VacationForm from '../component/Vacations/VacationForm';
import VacationList from '../component/Vacations/VacationList';
import UserProfileEdit from '../component/Users/UserProfileEdit';
import AwardComponent from '../component/Details/AwardComponent';
import CareerComponent from '../component/Details/CareerComponent';
import ProjectComponent from '../component/Details/ProjectComponent';
import axios from 'axios';

export default function UserInfoPage() {
    const [activeTab, setActiveTab] = useState<'info' | 'vacation'>('info');
    const [editMode, setEditMode] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setReFresh] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        const user = raw ? JSON.parse(raw) : null;

        if (user?.user_id) {
            setCurrentUser(user);
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

                    {/* 여기에 컴포넌트들만 섹션으로 추가 */}
                    <section style={{ marginTop: '30px' }}>
                        <CareerComponent viewedUserId={userInfo.user_id} currentUser={currentUser} />
                    </section>

                    <section style={{ marginTop: '30px' }}>
                        <ProjectComponent viewedUserId={userInfo.user_id} currentUser={currentUser} />
                    </section>

                    <section style={{ marginTop: '30px' }}>
                        <AwardComponent viewedUserId={userInfo.user_id} currentUser={currentUser} />
                    </section>
                
                </>
    )
}

{
    activeTab === 'vacation' && (
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
