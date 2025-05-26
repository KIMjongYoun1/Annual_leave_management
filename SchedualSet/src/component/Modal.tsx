interface ModalProps{
    isOpen: boolean;
    title: string;
    start: string;
    end: string;
    onClose: ()=> void;
    onDelete:() => void;
}
// 캘린더 홈 삭제 
export default function Modal({ isOpen, title, start, end, onClose, onDelete }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div style={{
        position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: '20px',
            border: '2px solid #333',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '300px',
            color: '#000'
      }}>
        <h3>{title}</h3>
        <p>기간: {start} ~ {end}</p>
        <button onClick={onDelete}>삭제</button>
        <button onClick={onClose}>닫기</button>
      </div>
    );
  }

  