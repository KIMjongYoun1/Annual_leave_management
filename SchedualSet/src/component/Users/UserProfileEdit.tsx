import { useState } from 'react';
import axios from 'axios';

interface User {
    user_id: string;
    user_name: string;
    department: string;
    position: string;
    email: string;
    phone: string;
    profile_image?: string;
}

export default function UserProfileEdit({ user, onCancel}: { user: User }) {
    const [department, setDepartMent] = useState(user.department || '');
    const [position, setPosition] = useState(user.position || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('department', department);
        formData.append('position', position);
        formData.append('email', email);
        formData.append('phone', phone);

        if (imageFile) {
            formData.append('profile_image', imageFile);
        }

        try {
            await axios.put(`http://localhost:3001/api/users/${user.user_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('수정완료');

            const updateUser = await axios.get(`http://localhost:3001/api/users/${user.user_id}`);
            window.location.reload();

        } catch (err) {
            console.error('수정실패', err);
            alert('수정실패');
        }

    };

    return (
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <div>
                <label>부서 :</label>
                <input type='text' value={department} onChange={(e) => setDepartMent(e.target.value)} />
            </div>
            <br></br>
            <div>
                <label>직급 : </label>
                <input type='text' value={position} onChange={(e) => setPosition(e.target.value)} />
            </div>
            <br></br>
            <div>
                <label>email : </label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <br></br>
            <div>
                <label>phone : </label>
                <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <br></br>
            <div>
                <label>프로필 이미지 :</label>
                <input type='file' accept="image/*" onChange={(e)=> setImageFile(e.target.files?.[0] || null)} />
            </div>
            <br></br>
            <button type='submit'>수정</button>
            <button type='button' onClick={onCancel}>취소</button>
        </form>
    );
}