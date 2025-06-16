import { useState } from 'react';
import MailList from '../component/Mail/MailList';
import MailCompose from '../component/Mail/MailCompose';
import MailDetail from '../component/Mail/MailDetail';

type TabType = 'inbox' | 'sent' | 'compose';

export default function MailPage() {
    const [tab, setTab] = useState<TabType>('inbox');
    const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.user_id;


    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
                <button onClick={() =>  { setTab('inbox'); setSelectedMailId(null); } }>받은 메일함</button>
                <button onClick={() =>  { setTab('sent'); setSelectedMailId(null); } } style={{ marginLeft: '10px' }}>보낸 메일함</button>
                <button onClick={() =>  { setTab('compose'); setSelectedMailId(null); } } style={{ marginLeft: '10px' }}>메일 쓰기</button>
            </div>
            {tab === 'compose' && <MailCompose userId={userId} />}
            {(tab === 'inbox' || tab === 'sent') && !selectedMailId && (
                <MailList type={tab} userId={userId} onSelectMail={(id) => setSelectedMailId(id)} />
            )}
            {(tab === 'inbox' || tab === 'sent') && selectedMailId && (
                <MailDetail mailId={selectedMailId} userId={userId} onBack={() => setSelectedMailId(null)} />
            )}
        </div>
    );
}