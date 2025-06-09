import { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom'
import { type Notice } from '../../interfaces/notice'


interface NoticeBoardProps {
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

export default function NoticeBoard({currentUser} : NoticeBoardProps) {
    const [ notices, setNotices ] = useState<Notice[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ searchText, setSearchText] = useState('');
    const [ filteredNotices, setFilteredNotices] = useState<Notice[]>([]);

    useEffect(()=>{
        fetchNotices();

    }, []);

    const fetchNotices = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/notices');
            setNotices(res.data);
        } catch (err) {
            console.error('공지사항 불러오기 실패', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await axios.get(`/api/notices/search?title=${searchText}`);
            setFilteredNotices(res.data);
        } catch (err) {
            console.error('검색 실패', err);
        }
    }

    return (
        <div style={boxStyle}>
            <h2>공지 사항</h2>
            <input type='text'
            placeholder='제목 검색'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: '10px', width: '100%', padding: '5px'}} />
            <button onClick={handleSearch}>검색</button>
           {currentUser.role === 'Admin' &&(
            <div style={{marginBottom: '10px', textAlign: 'right'}}>
                <Link to="/notices/new">
                <button>+ 새 글 작성</button>
                </Link>
            </div>
            )}

            {loading ? (
                <p>로딩중...</p>
            ) : notices.length === 0 ? (
                <p>공지 사항이 없습니다.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{background: '#f0f0f0#' }}>
                            <th style={{padding: '10px'}}>번호</th>
                            <th style={{padding: '10px'}}>제목</th>
                            <th style={{padding: '10px'}}>작성자</th>
                            <th style={{padding: '10px'}}>날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice, index) => (
                            <tr key={notice.notice_id} style={{borderBottom: '1px solid #ddd'}}>
                                <td style={{padding: '10px', textAlign: 'center'}}>{index + 1 }</td>
                                <td style={{padding: '10px'}}>
                                    <Link to={`/notices/${notice.notice_id}`} style={{textDecoration: 'none', color: 'black'}}>
                                    {notice.title}</Link>
                                </td>
                                <td style={{padding: '10px', textAlign: 'center'}}>{notice.notice_id}</td>
                                <td style={{padding: '10px', textAlign: 'center'}}>{new Date(notice.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );}
        </div>
    )
}