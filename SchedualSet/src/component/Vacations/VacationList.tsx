import { useEffect, useState } from 'react';
import axios from 'axios';

interface Vacation {
    vacation_id: number;
    title: string;
    start_date: string;
    end_date: string;
    leave_type: string;
}

interface Props {
    userId: string;
    refresh: boolean;
}

export default function VacationList({userId,refresh}: Props) {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/vacations/user/${userId}`);
                setVacations(res.data);
            } catch (err) {
                console.error('📛 휴가 데이터 조회 실패', err);
            }
        };

        fetchVacations();
    }, [userId, refresh]);

    const handleDelete = async (vacationId: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/vacations/${vacationId}`);
            setVacations(prev => prev.filter(v => v.vacation_id !== vacationId));
            alert('삭제 성공');
        } catch (err) {
            console.error('❌ 삭제 실패', err);
        }
    };

    if (!vacations || vacations.length === 0) {
        return <p>등록된 휴가가 없습니다.</p>;
    }

    return (
        <ul>
            {vacations.map((v) => {
                let typeLabel = '기타';
                if (v.leave_type === 'Half') typeLabel = '반차';
                else if (v.leave_type === 'Annual') typeLabel = '연차';
                else if (v.leave_type === 'Sick') typeLabel = '병가';

                return (
                    <li key={v.vacation_id}>
                        {v.start_date} ~ {v.end_date} / 종류: {typeLabel}
                        <button onClick={() => handleDelete(v.vacation_id)}>삭제</button>
                    </li>
                );
            })}
        </ul>
    );
}
