// index.js (Express 백엔드 진입점)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// DB 설정
const pool = require('./db');

// 라우터 불러오기
const userRoutes = require('./routes/users');
const vacationRoutes = require('./routes/vacation');
const leaveBalanceRoutes = require('./routes/leaveBalance');
const adminRoutes = require('./routes/admin');

app.use(cors());
app.use(express.json()); // JSON 바디 파싱

// 라우터 등록
app.use('/api/users', userRoutes);        // 회원가입, 로그인 등
app.use('/api/vacations', vacationRoutes); // 휴가 등록, 조회, 삭제
app.use('/api/leave', leaveBalanceRoutes); // 잔여 연차 계산 및 관리
app.use('/api/admin', adminRoutes); // 관리자 페이지 관련 기능

// 서버 시작
app.listen(PORT, () => {
  console.log(`백엔드 서버 실행: http://localhost:${PORT}`);
});
