import { useEffect, useState } from 'react';
import axios from 'axios';

interface MailDetailProps {
    mailId: number;
    userId: string;
    onBack: () => void;
}

interface Mail {
    title: string;
    content: string;
    from_id: string;
    to_id: string;
    sent_at: string;
    attachment?: string[]; //파일이름 목록 배열
}

export default function MailDetail ({mailId, userId, onBack}: MailDetailProps) {
    const [ mail, setMail ] = useState<Mail | null>(null);

    useEffect(() => {
        axios.get(`/api/mails/detail/${mailId}`)
        .then(res => setMail(res.data))
        .catch(err => console.error('메일 상세조회 실패', err));
    }, [mailId]);

    if (!mail) return<p>로딩중...</p>

    return (
        <div style={{border: '1px solid #ddd', padding: '15px'}}>
            <button onClick={onBack}>뒤로가기</button>
            <h3>{mail.title}</h3>
            <p><strong>보낸 사림</strong>{mail.from_id}</p>
            <p><strong>받는 사람</strong>{mail.to_id}</p>
            <p><strong>보낸 시간</strong>{mail.sent_at}</p>
            <div style={{marginTop: '20px', whiteSpace: 'pre-line'}}>{mail.content}</div>
            
            {mail.attachment && mail.attachment.length > 0 && (
                <div style={{marginTop: '20px'}}>
                    <strong>첨부 파일</strong>
                    <ul>
                        {mail.attachment.map((file, idx) => (
                            <li key={idx}>
                                <a href={`/uploads/${file}`} download>{file}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}