import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { type Notice } from '../../interfaces/notice';



export default function NoticeSummaryList() {

    const [notices, setNotices] = useState<Notice[]>([]);
    const NOTICE_API = '/api/notices';

    useEffect(() => {
        axios.get('http://localhost:3001/api/notices')
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : [];
      
            const filtered = data
            //   .filter((n: Notice) => n.category === '' && n.created_at)
              .sort((a, b) => {
                const timeA = new Date(a.created_at).getTime();
                const timeB = new Date(b.created_at).getTime();
                return timeB - timeA;
              })
              .slice(0, 3);
      
            setNotices(filtered);
            console.log('불러온공지',res.data);
          })
          .catch((err) => {
            console.error('📛 공지조회 실패:', err);
          });
      }, []);
      

   return (
    <div>
        <h3>긴급 공지</h3>
        <ul>
            {notices.map((n)=> (
                <li key={n.notice_id}>
                    <Link to={`/notices/${n.notice_id}`}>[{n.category}] {n.title} </Link>
                    <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666'}}>
                        {new Date(n.created_at).toLocaleDateString()}
                    </span>
                </li>
            ))}
        </ul>
    </div>
   );
}