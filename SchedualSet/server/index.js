// index.js (Express 백엔드 진입점)
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
// 미들웨어
const path = require('path');

// DB 설정
const pool = require('./db');

// 라우터 불러오기
const userRoutes = require('./routes/users');
const vacationRoutes = require('./routes/vacation');
const leaveBalanceRoutes = require('./routes/leaveBalance');
const adminRoutes = require('./routes/admin');
const awardRoutes = require('./routes/details');
const noticesRoutes = require('./routes/notices');
const mailRoutes = require('./routes/mail'); // 경로 정확히 확인


app.use(cors());
app.use(express.json()); // JSON 바디 파싱
app.use(express.urlencoded({ extended: true }));
// 라우터 등록
app.use('/api/users', userRoutes);        // 회원가입, 로그인 등
app.use('/api/vacations', vacationRoutes); // 휴가 등록, 조회, 삭제
app.use('/api/leave', leaveBalanceRoutes); // 잔여 연차 계산 및 관리
app.use('/api/admin', adminRoutes); // 관리자 페이지 관련 기능
app.use('/api/notices', noticesRoutes); // 공지사항 관련 기능
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/mails', mailRoutes); // ✅ 이거 빠져있었음!

app.use(awardRoutes);
// 서버 시작
app.listen(PORT, () => {
  console.log(`백엔드 서버 실행: http://localhost:${PORT}`);
});
