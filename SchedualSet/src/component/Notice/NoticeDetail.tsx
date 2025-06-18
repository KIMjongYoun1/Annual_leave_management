import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { type Notice } from '../../interfaces/notice';
import { Link } from 'react-router-dom';

interface NoticeDetailProps{
    currentUser: {
        user_id: string;
        role: string;
    };
}



export default function NoticeDetail({ currentUser }: NoticeDetailProps) {
    const { notice_id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/notices/${notice_id}`)
            .then((res) => setNotice(res.data))
            .catch((err) => console.error('공지 상세 불러오기 실패', err))
                .finally(() => setLoading(false));
    }, [notice_id]);

    const handleDelete = async () => {
        if (!window.confirm('삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:3001/api/notices/${notice_id}`);
            alert('삭제 완료');
            navigate('/notices');
        } catch (err) {
            alert('삭제 실패');
            console.log( `선택 공지 : ${notice_id}`)
        }
    };

    if (loading) return <p>로딩중..</p>;
    if (!notice) return <p>...no</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>{notice.title}</h2>
            <p style={{ fontSize: '14px', color: 'black' }}>
                작성자: {notice.author_id} | 날짜" {new Date(notice.created_at).toLocaleDateString()}
            </p>
            <hr />
            <div style={{ whiteSpace: 'pre-wrap', margin: '20px 0' }}>{notice.content}</div>

            {(currentUser.role === 'Admin') && (
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <Link to="/notices/new">
                        <button>+ 새글작성 </button>
                    </Link>
                    <button onClick={() => navigate(`/notices/edit/${notice.notice_id}`)}>수정</button>
                    <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>삭제</button>
                </div>
            )}
        </div>
    )
}