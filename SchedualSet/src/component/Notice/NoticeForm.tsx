import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface NoticeFormProps {
    currentUser: {
        user_id: string;
        role: string;
    };
}

const intialFormState = {
    title: '',
    content: '',
    category: ''
};

export default function NoticeForm({ currentUser }: NoticeFormProps) {
    const { notice_id } = useParams();
    const [ formData, setFormData ] = useState(intialFormState);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (notice_id) {
            axios.get(`http://localhost:3001/api/notices/${notice_id}`)
                .then((res) => {
                    const { title, content, category } = res.data;
                    setFormData({ title, content, category });
                }).catch((err) => {
                    console.error(' NOtice 불러오기 실패', err);
                }).finally(() => setLoading(false));
        }
    }, [notice_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.category) {
            alert('제목과 카고리는 필수입니다.');
            return;
        }

        try {
            if (notice_id) {
                await axios.put(`http://localhost:3001/api/notices/${notice_id}`, formData);
                alert('수정완료');
            }
            else {
                await axios.post(`http://localhost:3001/api/notices`, {
                    ...formData,
                    author_id: currentUser.user_id
                });
                alert('작성 완료');
            }
            navigate('/notices');
        } catch (err) {
            alert('작성/수정 실패');
            console.error(err);
        }
    };

    if (loading) return <p>로딩중...</p>

    return (
        <div style={{ padding: '20px' }}>
            <h2>{notice_id ? '공지 수정' : '공지 작성'} </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목 : </label>
                    <input type='text'
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                    <label>카테고리 : </label>
                    <select value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} required >
                        <option value=""> 선택</option>
                        <option value="일반">일반</option>
                        <option value="긴급">긴급</option>
                    </select>
                </div>
                <div>
                    <label>내용 : </label>
                    <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})} rows = {20} />
                </div>

                <div style={{marginTop: '10px'}}>
                    <button type='submit'>{notice_id ? '수정하기' : '작성하기'}</button>
                </div>
            </form >
        </div >
    );
}