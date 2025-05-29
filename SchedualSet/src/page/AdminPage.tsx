import { useState } from 'react';
import AdmUserManagement from '../component/Admin/AdmUserManagement'; // 파일명과 일치시켜야 함
import AdmVacationManagement from '../component/Admin/AdmVacationManagement'; // 휴가 관리 탭은 이후 구현

export default function AdminPage() {
    const [tab, setTab] = useState<'user' | 'vacation'>('user');

    return (
        <div style={{ padding: '20px' }}>
            <h2>관리자 페이지</h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button onClick={() => setTab('user')}>유저 관리</button>
                <button onClick={() => setTab('vacation')}>휴가 관리</button>
            </div>

            {tab === 'user' && <AdmUserManagement />}
            {tab === 'vacation' && <AdmVacationManagement />}
        </div>
    );
}
