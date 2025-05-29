import { useEffect, useState } from 'react';
import axios from 'axios';
import ExcelDownload from '../Utill/ExcelDownload.tsx'; // 실제 경로에 맞게 수정

interface Vacation {
    vacation_id: number;
    user_id: string;
    title: string;
    start_date: string;
    end_date: string;
    leave_type: string;
}

const leaveTypeMap: { [key: string]: string } = {
    Annual: '연차',
    Half: '반차',
    Sick: '병가',
};

export default function AdmVacationManagement() {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [userid, setUserId] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [page, setPage] = useState(1);

    const [filters, setFilters] = useState({
        user_name: '',
        department: '',
        month: '',
    });

    const fetchVacations = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/admin/vacations', {
                params: {
                    user_name: filters.user_name || undefined,
                    department: filters.department || undefined,
                    month: filters.month || undefined,
                    page, size: 10
                }
            });
            setVacations(res.data);
        } catch (err) {
            console.error('휴가 조회 실패', err);
        }
    };



    useEffect(() => {
        fetchVacations();
    }, [page]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, month: e.target.value });
    }

    const handleSerch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchVacations();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>전체 휴가 목록</h2>

            {/* 필터 */}
            <form onSubmit={handleSerch} style={{ marginBottom: '20px' }}>
                <select onChange={handleMonthChange} style={{ marginRight: '10px' }}>
                    <option value="">전체</option>
                    <option value="2025-06">2025년 6월</option>
                    

                </select>


                <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    style={{ marginRight: '10px' }}
                >
                    <option value="">전체 부서</option>
                    <option value="인사팀">인사팀</option>
                    <option value="개발팀">개발팀</option>
                </select>
                <input
                    type="text"
                    placeholder="사용자 이름 검색"
                    value={filters.user_name}
                    onChange={(e) => setFilters({ ...filters, user_name: e.target.value })}
                    style={{ marginRight: '10px' }}
                />

                <input
                    type="month"
                    value={filters.month}
                    onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                />

                <button type='submit'>검색</button>
            </form>

       
            {/* 테이블 */}
            <table>
                <thead>
                    <tr>
                        <th>사용자</th>
                        <th>휴가유형</th>
                        <th>시작일</th>
                        <th>종료일</th>
                        {/* <th>제목</th> */}
                    </tr>
                </thead>
                <tbody>
                    {vacations.map((v) => (
                        <tr key={v.vacation_id}>
                            <td>{v.user_id}</td>
                            <td>{leaveTypeMap[v.leave_type] || v.leave_type}</td>
                            <td>{v.start_date}</td>
                            <td>{v.end_date}</td>
                            {/* <td>{v.title}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
                 {/* ✅ 엑셀 다운로드 버튼 추가 */}
                 <div style={{ marginBottom: '20px' }}>
                <ExcelDownload data={vacations} fileName={`휴가목록_${page}페이지`} />
            </div>

            {/* 페이지버튼 */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} >이전</button>
                <span style={{ margin: '10px' }}>{page} 페이지</span>
                <button onClick={() => setPage((p) => Math.max(1, p + 1))}>다음</button>
            </div>
        </div>
    );
}