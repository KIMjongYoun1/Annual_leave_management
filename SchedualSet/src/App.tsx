
import React from 'react';
import VacationForm from './component/Vacations/VacationForm';
import VacationCalendar from './page/VacationCalender';
import RegisterPage from './page/RegisterPage';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css'
import LoginPage from './page/LoginPage';
import UserInfoPage from './page/UserInfoPage';
import ProtectedRoute from './routes/ProtectedRoute';
import LogoutPage from './page/LogoutPage';
import AppHeader from './component/AppHeader';
import AdminPage from './page/AdminPage';
import NoticeBoard from './component/Notice/NoticeBoard';
import NoticeDetail from './component/Notice/NoticeDetail';
import NoticeForm from './component/Notice/NoticeForm';
import MainPage from './page/MainPage';
import MailPage from './page/MailPage';
import MailCompose from './component/Mail/MailCompose';
import MailDetailWrapper from './component/Mail/MailDetailWrapper';



function App() {
  // const [events, setEvents] = useState([]);
  //  prop 확장 대비용 path="/claendar" element={-----} evets={evets}
  // 현재는 캘린더 한곳에서만 사용하기에 내부처리 되어있음
  const raw = localStorage.getItem('user');
  const currentUser = raw ? JSON.parse(raw) : null; // 유저 선언 추가 하위컴포넌트에 유저값 전달

  return (

    <Router>
      <nav>

      </nav>
      <AppHeader />
      <Routes>
        <Route path="/" element={<MainPage currentUser={currentUser} />} />
        <Route path="/user/info" element={<ProtectedRoute><UserInfoPage /></ProtectedRoute>} />
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<VacationCalendar />} />
        <Route path="/vacations" element={<VacationForm
          userId={currentUser?.user_id}
          userName={currentUser?.user_name}
          onSuccess={() => { }} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/notices" element={<NoticeBoard currentUser={currentUser} />} />
        <Route path="/notices/:notice_id" element={<NoticeDetail currentUser={currentUser} />} />
        <Route path="/notices/new" element={<NoticeForm currentUser={currentUser} />} />
        <Route path="/notices/edit/:notice_id" element={<NoticeForm currentUser={currentUser} />} />
        <Route path="/mails" element={<ProtectedRoute> <MailPage /> </ProtectedRoute>} />
        <Route path="/mails/compose" element={<ProtectedRoute><MailCompose userId={currentUser?.user_id} /></ProtectedRoute>} />
        <Route path="/mails/:mailId" element={<ProtectedRoute><MailDetailWrapper /></ProtectedRoute>} />

        {/* <Route path="/user/awards" element={<AwardComponent />} />
        <Route path="/user/careers" element={<CareerComponent />} />
        <Route path="/user/projects" element={<ProjectComponent />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
