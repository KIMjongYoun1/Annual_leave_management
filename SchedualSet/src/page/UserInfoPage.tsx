import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserProfile from '../component/UserProfile';
import LeaveBalance from '../component/LeaveBalance';
import VacationForm from '../component/VacationForm';
import VacationList from '../component/VacationList';

export default function UserInfoPage() {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;

    const [activeTab, setActiveTab] = useState<'info' | 'vacation'>('info');

    if (!user || !user.user_id) {
        return <Navigate to='/users/login' />;
    }

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
                    <UserProfile userInfo={user} />
                    <LeaveBalance userid={user.user_id} />
                    {/* (향후) 수상/경력 추가 예정 */}
                </>
            )}

            {activeTab === 'vacation' && (
                <>
                    <VacationForm userId={user.user_id} userName={user.user_name} />
                    <VacationList userId={user.user_id} />
                </>
            )}
        </div>
    );
}
