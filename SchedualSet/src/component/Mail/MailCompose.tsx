import { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


type MailComposeProps = {
    userId: string;
};

export default function MailCompose({ userId }: MailComposeProps) {

    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string>('');
    const [attachments, setAttachments] = useState<FileList | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!to.trim() || !title.trim()) {
            alert('필수 항목을 입력해 주세요');
            return;
        }

        const formData = new FormData();
        formData.append('from_id', userId);
        formData.append('to_id', to);
        formData.append('cc', cc);
        formData.append('title', title);
        formData.append('content', content);

        if (attachments) {
            Array.from(attachments).forEach((file) =>
                formData.append('attachments[]', file));
        }
        try {
            await axios.post('/api/mails', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('메일 발송 완료');

            setTo('');
            setCc('');
            setTitle('');
            setContent('');
            setAttachments(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
            console.error('메일전송실패', err);
            alert(err.response?.data.message || '메일 전송 실패')
            
            }
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>받는사람 : </label>
                <input value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
                <label>참조 : </label>
                <input value={cc} onChange={(e) => setCc(e.target.value)} />
            </div>
            <div>
                <label>제목 : </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>내용 : </label>
                <ReactQuill value={content} onChange={setContent} />
            </div>
            <div>
                <label>첨부 파일 : </label>
                <input type="file" multiple onChange={(e) => setAttachments(e.target.files)} />
            </div>
            <button type="submit">메일 보내기</button>
        </form>
    );


}