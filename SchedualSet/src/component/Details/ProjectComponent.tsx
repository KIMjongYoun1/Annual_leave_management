import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Project {
    project_id: number;
    user_id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
}

interface ProjectComponentProps {
    viewedUserId: string;
    currentUser: {
      user_id: string;
      role: string;
    };
  }

const boxStyle: React.CSSProperties = {
    flex: 1,
    height: '230px',
    minWidth: '200px',
    border: '1px solid #ccc',
    padding: '5px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflowY: 'auto'
};

export default function ProjectComponent({viewedUserId, currentUser}: ProjectComponentProps) {
   
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState({ title: '', description: '', start_date: '', end_date: '' });
    const [editProjectId, setEditProjectId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ title: '', description: '', start_date: '', end_date: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/projects/${viewedUserId}`);
            setProjects(res.data);
        } catch (err) {
            console.error('수상 이력 조회 실패', err);
        }
    };

    const handleAdd = async () => {
        if (!newProject.title || !newProject.start_date || !newProject.end_date) {
            alert('제목과 날짜는 필수 입니다.');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/projects', {
                ...newProject, user_id: viewedUserId
            });
            setNewProject({ title: '', description: '', start_date: '', end_date: ''  });
            setShowAddForm(false);
            fetchProjects();
        } catch (err) {
            console.error('추가실패', err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/projects/${id}`);
            fetchProjects();
        } catch (err) {
            console.error('삭제 실패', err);
        }
    };

    const handleEdit = (project: Project) => {
        setEditProjectId(project.project_id);
        setEditData({
            title: project.title,
            start_date: project.start_date,
            end_date: project.end_date,
            description: project.description
        });
    };

    const handleUpdate = async (id: number) => {
        try {
            await axios.put(`http://localhost:3001/api/projects/${id}`, editData);
            setEditProjectId(null);
            fetchProjects();
        } catch (err) {
            console.error('수정 실패', err);
        }
    };

    return (
        <div style={boxStyle}>
            <h3>프로젝트</h3>
            <table style={{ width: '100%', fontSize: '14px' }} >
                <thead>
                    <tr>
                        <th>프로젝트 명</th>
                        <th>시작일</th>
                        <th>종료일</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.project_id}>
                            {editProjectId === project.project_id ? (
                                <>
                                    <td><input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} /></td>
                                    <td><input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>
                                    <td><input type="date" value={editData.start_date} onChange={(e) => setEditData({ ...editData, start_date: e.target.value })} /></td>
                                    <td><input type="date" value={editData.end_date} onChange={(e) => setEditData({ ...editData, end_date: e.target.value })} /></td>
                                    <td>
                                        <button onClick={() => handleUpdate(project.project_id)}>저장</button>
                                        <button onClick={() => setEditProjectId(null)}>취소</button>
                                    </td>
                                </>) : (
                                <>
                                    <td>{project.title}</td>
                                    <td>{project.start_date}</td>
                                    <td>{project.end_date}</td>
                                    <td>{project.description}</td>
                                    {(currentUser.user_id === project.user_id || currentUser.role === 'Admin') && (
                                        <>
                                            <button onClick={() => handleEdit(project)}>수정</button>
                                            <button onClick={() => handleDelete(project.project_id)}>삭제</button>
                                        </>
                                    )}
                                </>

                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            { /* 입력폼 */}
            <button onClick={()=> setShowAddForm(true)}>추가</button>
            {showAddForm && (
            (currentUser.user_id === viewedUserId || currentUser.role === 'Admin') && (
                <div style={{ marginTop: '10px' }}>
                    <input
                        placeholder='프로젝트 명'
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
                    <br />
                    <input
                        type="date"
                        value={newProject.start_date}
                        onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })} />
                    <br />
                    <input
                        type="date"
                        value={newProject.end_date}
                        onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })} />
                    <br />
                    <input
                        type = "text"
                        placeholder='내용'
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                   <br />
                    <button onClick={handleAdd}>추가</button>
                    <button onClick={()=> setShowAddForm(false)}>취소</button>
                </div>
            ))}
        </div>
    );
}