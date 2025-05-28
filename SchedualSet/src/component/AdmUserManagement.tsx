import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
    user_id: string;
    user_name: string;
    department: string;
    position: string;
    role: string;
}

export default function AdmUserManagement() {

    const [users, setUsers] = useState<User[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (!user || user.role !== 'Admin') {
            alert('접근권한이 없습니다');
            navigate('/');
        }
    })

    useEffect(() => {
        axios.get('http://localhost:3001/api/admin/users')
            .then(res => { setUsers(res.data);
        const initRoles: { [key: string]: string } = {};
        res.data.forEach((u: User) => {
            initRoles[u.user_id] = u.role;
        });
        setSelectedRoles(initRoles);
    })
        .catch(err => console.error('관리자 유저 조회 실패', err));
}, []);

const handleRoleSelect = (user_id: string, newRole: string) => {
    setSelectedRoles(prev => ({ ...prev, [user_id]: newRole }));
}

const handleRoleChange = async (user_id: string) => {
    try {
        const selectedRole = selectedRoles[user_id];
        await axios.put(`http://localhost:3001/api/admin/users/${user_id}/role`, { role: selectedRole });
        alert('권한변경 성공');
        const res = await axios.get(`http://localhost:3001/api/admin/users`);
        setUsers(res.data);
        console.log('값', res.data);
    } catch (err) {
        alert('변경실패');
        console.error(err);
    }
}
return (
    <div style={{ padding: '20px' }}>
        <h2>관리자 전용 - 유저목록</h2>
        <table>
            <thead>
                <tr>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>직급</th>
                    <th>권한</th>
                </tr>
            </thead>
            <tbody>
                {users.map(u => (
                    <tr key={u.user_id}>
                        <td>{u.user_id}</td>
                        <td>{u.user_name}</td>
                        <td>{u.department}</td>
                        <td>{u.position}</td>
                        <td>{u.role}</td>
                        <td>
                            <select value={selectedRoles[u.user_id]} onChange={(e) => handleRoleSelect(u.user_id, e.target.value)}>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <button onClick={() => handleRoleChange(u.user_id)} style={{ marginLeft: '8px' }}>변경</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

}