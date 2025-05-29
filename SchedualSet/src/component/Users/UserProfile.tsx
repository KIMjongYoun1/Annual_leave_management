import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    user_id: string;
    user_name: string;
    department: string;
    position: string;
    profile_image?: string;
    email?: string;
    phone?: string;
}

interface LeaveBalance {
    remaining_days: number;
    used_days: number;
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
};

export default function UserProfile({ userInfo }: { userInfo: User | null }) {
    const [leave, setLeave] = useState<LeaveBalance | null>(null);

    useEffect(() => {
        if (userInfo?.user_id) {
            axios.get(`http://localhost:3001/api/leave/${userInfo.user_id}`)
                .then(res => setLeave(res.data))
                .catch(err => console.error('연차정보 조회 실패', err));
        }
    }, [userInfo]);

    if (!userInfo) return <p>유저 정보를 불러오는 중...</p>;

    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            {/* 프로필 이미지 박스 */}
            <div style={boxStyle}>
                <img
                    src={`http://localhost:3001/uploads/${userInfo.profile_image || 'default.png'}`}
                    alt="프로필 이미지"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />
            </div>

            {/* 기본정보 박스 */}
            <div style={{ ...boxStyle, fontSize: '10px', overflowY: 'auto' }}>
                <h3 style={{ marginBottom: '6px' }}>기본 정보</h3>
                <p><strong>이름:</strong> {userInfo.user_name}</p>
                <p><strong>부서:</strong> {userInfo.department}</p>
                <p><strong>직급:</strong> {userInfo.position}</p>
                <p><strong>아이디:</strong> {userInfo.user_id}</p>
                <p><strong>이메일:</strong> {userInfo.email || '-'}</p>
                <p><strong>연락처:</strong> {userInfo.phone || '-'}</p>
            </div>

            {/* 연차정보 박스
            <div style={{ ...boxStyle, fontSize: '14px' }}>
                <h3 style={{ marginBottom: '8px' }}>연차 정보</h3>
                {leave ? (
                    <>
                        <p><strong>잔여 연차:</strong> {leave.remaining_days}일</p>
                        <p><strong>사용 연차:</strong> {leave.used_days}일</p>
                    </>
                ) : (
                    <p>연차 정보를 불러오는 중...</p>
                )} */}
            {/* </div> */}
        </div>
    );
}

