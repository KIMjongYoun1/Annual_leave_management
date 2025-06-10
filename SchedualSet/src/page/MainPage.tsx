import { Link } from 'react-router-dom';
import NoticeSummaryList from '../component/Notice/NoticeSummaryList';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from 'react';
import axios from 'axios';


interface MainPageProps {
    currentUser: {
        user_id: string;
        user_name: string;
        department: string;
        position: string;
    };
}

interface VacationEvent {
    title: string;
    start: string;
    end: string;
}

export default function MainPage({ currentUser }: MainPageProps) {
    const [events, setEvents] = useState<VacationEvent[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/vacations')
            .then(res => {
                const formatted = res.data.map((v: any) => ({
                    title: v.name + ' - ' + v.title,
                    start: v.start_date,
                    end: new Date(new Date(v.end_date).getTime() + 86400000).toISOString().slice(0, 10),
            }))
        setEvents(formatted);
}).catch (err => console.error('캘린더 이벤트 불러오기 실패', err));
    }, []);

return (
    <div style={{ padding: '20px' }}>
        {/*상단 유저 정보 */}
        <div style={userInfoStyle}>
            {currentUser ? (
                <>
            <h2>{currentUser.user_name}님, 환영합니다 ^_^</h2>
            <p>{currentUser.department}, {currentUser.position}</p>
            <div style={{ marginTop: '10px' }}>
                <Link to="/user/info"><button>내 정보 보기</button></Link>
                <Link to="/mail"><button style={{ marginLeft: '10px' }}>메일함</button></Link>
            </div>
            </>
            ) : (
                <>
                <h2>환영 합니다</h2>
                <p>로그인후 더 많은 기능을 이용 할 수 있어요!</p>
                <Link to="/users/login"><button>로그인</button></Link>
                </>
            )}
        </div>

        {/* 공지 목록 */}
        <section style={sectionStyle}>
            <h3><Link to="/notices">최근 공지사항</Link></h3>
            <NoticeSummaryList />
        </section>

        { /* 캘린더 요약 */}
        <section style={sectionStyle}>
            <h3><Link to="/calendar">휴가 목록</Link></h3>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                events={events}
                height="auto"
                headerToolbar={false}
                editable={false}
                selectable={false} />
        </section>
    </div>
);

}
const userInfoStyle: React.CSSProperties = {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '30px'
};

const sectionStyle: React.CSSProperties = {
    marginBottom: '30px',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fafafa'
};
