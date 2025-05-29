
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
// import AwardComponent from './component/Details/AwardComponent';
// import CareerComponent from './component/Details/CareerComponent';
// import ProjectComponent from './component/Details/ProjectComponent';





function App() {
  // const [events, setEvents] = useState([]);
  //  prop 확장 대비용 path="/claendar" element={-----} evets={evets}
  // 현재는 캘린더 한곳에서만 사용하기에 내부처리 되어있음

  return (

    <Router>
      <nav>

      </nav>
      <AppHeader />
      <Routes>
        <Route path="/user/info" element={<ProtectedRoute><UserInfoPage /></ProtectedRoute>} />
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/calendar" />} />
        <Route path="/calendar" element={<VacationCalendar />} />
        <Route path="/vacations" element={<VacationForm />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* <Route path="/user/awards" element={<AwardComponent />} />
        <Route path="/user/careers" element={<CareerComponent />} />
        <Route path="/user/projects" element={<ProjectComponent />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
