import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Notice } from '../../interfaces/notice';



export default function NoticeSummaryList() {

    const [notices, setNotices] = useState<Notice[]>([]);
    const NOTICE_API = '/api/notices';

    useEffect(() => {
    axios.get(NOTICE_API).then((res) => {
        const filtered = res.data
            .filter((n: Notice) => n.category === '긴급')
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
        setNotices(filtered);
    })
    .catch((err) => {
        console.error('공지조회 실패', err);
    });
}, []);

   return (
    <div>
        <h3>긴급 공지</h3>
        <ul>
            {notices.map((n)=> (
                <li key={n.notice_id}>
                    <Link to={`/notices/${n.notice_id}`}>{n.title}</Link>
                    <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666'}}>
                        {new Date(n.created_at).toLocaleDateString()}
                    </span>
                </li>
            ))}
        </ul>
    </div>
   );
}