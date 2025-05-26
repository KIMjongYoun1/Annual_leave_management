import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../component/Modal';



interface VacationEvent {
    vacation_id: number;
    user_id: string;
    name: string;
    title: string;
    start: string; //YYYY-MM-DD
    end: string; //풀캘린더는 종료일 포함안해서 +1 필요
}



export default function VacationClendar() {
     //풀캘린더 이벤트 
    const [events, setEvents] = useState<VacationEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<VacationEvent | null >(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(( )=> {
        fetchEvents();
    }, []);

    const fetchEvents = async () =>{
        try {
            const res = await axios.get('http://localhost:3001/api/vacations');
            const formatted = res.data.map((item:any) =>({
                title: `${item.name} - ${item.title}`,
                start: formatDateFromDB(item.start_date),
                end: plusOneDay(item.end_date),
                allDay:true,
                extendedProps:{
                vacation_id: item.vacation_id,
                user_id: item.user_id,
                name: item.name,
                title: item.title
                }
                
            }));
            setEvents(formatted);
        } catch (err) {
            console.error('휴가불러오기 실패', err);
        }
    };
    const handleEventClick =(info:any) => {

    console.log("🟡 handleEventClick 호출됨:", info);

       const event = info.event;
      
       if (!event.extendedProps) {
        console.warn('❌ extendedProps가 존재하지 않습니다.', event);
        return;
      }
    
      const clickedEvent = {
        vacation_id: event.extendedProps.vacation_id,
        user_id: event.extendedProps.user_id,
        name: event.extendedProps.name,
        title: event.title,
        start: event.startStr,
        end: event.endStr
      };
      
      console.log("🟢 클릭된 이벤트 객체:", clickedEvent);

      if (String(clickedEvent.user_id) === String(user.user_id)) {
        setSelectedEvent(clickedEvent);
        setIsModalOpen(true);
       
      } else {
        alert('다른 사용자의 휴가는 삭제할 수 없습니다.');
      }
      

        setIsModalOpen(true);
     };
        
      
    

   const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
        await axios.delete(`http://localhost:3001/api/vacations/${selectedEvent.vacation_id}`);
        setIsModalOpen(false);
        fetchEvents();
    } catch (err) {
        alert("삭제실패");
    }
   };

   
      //종료일 날짜를 하루 늘리는 보정 함수
  function plusOneDay(dateStr: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);// ✅ 1일 더해서 한국시간 기준으로 복구
    return formatDate(date); // ⬇️ 아래와 함께 사용
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDateFromDB(dateStr: string): string {
    const date = new Date(dateStr); // DB에서 온 날짜를 Date로 해석
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



    return (
        <div>
            <h2>Vacation</h2>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={(arg: EventClickAtg) => handleEventClick(arg)
                }
                height="auto"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                }}
                />



{isModalOpen && selectedEvent && (

    <Modal
  isOpen={isModalOpen}
  title={selectedEvent?.title || ''}
  start={selectedEvent?.start || ''}
  end={selectedEvent?.end || ''}
  onClose={() => setIsModalOpen(false)}
  onDelete={() =>handleDelete()}
/>
   
)}
        </div>
    );
}