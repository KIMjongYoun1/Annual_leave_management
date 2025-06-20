import { useParams } from 'react-router-dom';
import MailDetail from './MailDetail';

function MailDetailWrapper() {
  const { mailId } = useParams(); // ← URL에서 mailId 추출
  const raw = localStorage.getItem('user');
  const currentUser = raw ? JSON.parse(raw) : null;

  return (
    <MailDetail
      mailId={Number(mailId)}
      userId={currentUser?.user_id}
      onBack={() => window.history.back()}
    />
  );
}

export default MailDetailWrapper;