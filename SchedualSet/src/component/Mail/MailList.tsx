import { useEffect, useState } from 'react';
import axios from 'axios';

type MailListProps = {
    type: 'inbox' | 'sent';
    userId: string;
    onSelectMail: (id: number) => void;
};

interface Mail {
    mail_id: number;
    title: string;
    content: string;
    from_id: string;
    to_id: string;
    sent_at: string;
    has_attachment?: boolean;
}

export default function MailList({ type, userId, onSelectMail }: MailListProps) {
    const [mails, setMails] = useState<Mail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMails = async () => {
          try {
            const res = await axios.get(`/api/mails/${type}/${userId}`);
            console.log('응답 확인:', res.data);
      
            if (!Array.isArray(res.data)) {
              console.error('서버에서 배열이 아닌 데이터를 반환했습니다:', res.data);
              setMails([]); // 빈 배열로 초기화해 UI가 깨지지 않게 처리
              return;
            }
      
            setMails(res.data);
          } catch (err) {
            console.error('메일 목록 조회 실패', err);
            setMails([]); // 실패했을 때도 안전하게
          } finally {
            setLoading(false);
          }
        };
      
        fetchMails();
      }, [type, userId]);
      

    if (loading) return <p>불러오는중...</p>
    if (mails.length === 0) return <p>메일이 없습니다.</p>

    return (
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
                <tr style={{backgroundColor: '#f5f5f5'}}>
                    <th style={{padding: '10px'}}>제목</th>
                    <th style={{padding: '10px'}}>{type === 'inbox' ? '보낸 사람' : '받는 사람'}</th>
                    <th style={{padding: '10px'}}>날짜</th>
                    <th style={{padding: '10px'}}>첨부파일</th>
                </tr>
            </thead>
            <tbody>
                {mails.map((mail) => (
                    <tr key={mail.mail_id} style={{borderBottom: '1px solid #ddd', cursor: 'pointer'}} onClick={() => onSelectMail(mail.mail_id) }>
                        <td style={{padding: '10px'}}>{mail.title}</td>
                        <td style={{padding: '10px'}}>{type === 'inbox' ? mail.from_id : mail.to_id}</td>
                        <td style={{padding: '10px'}}>{new Date(mail.sent_at).toLocaleDateString()}</td>
                        <td style={{padding: '10px', textAlign: 'center'}}>
                            {mail.has_attachment ? 'O' : ''}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}