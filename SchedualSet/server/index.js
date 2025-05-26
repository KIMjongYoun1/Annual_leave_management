const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;


//미들웨어설정
app.use(cors());
app.use(express.json());
//라우터설정
const registerRoutes = require('./routes/users');
const vacationRoutes = require('./routes/vacation');
const leaveBalanceRouters = require('./routes/leaveBalance');
const pool = require('./db');

app.use('/api/users', registerRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/leave', leaveBalanceRouters);





// 테스트 기본 라우터
app.get('/api/vacations', async (req, res)=> {
    try {
        const [rows] = await pool.execute(
        'SELECT * FROM vacations'
        );
        res.json(rows);
        
    } catch (err) {
        console.log('휴가 조회 실패', err)
        console.error('휴가 등록 실패:', err.message); // 핵심 원인 출력

        res.status(500).json({error: '조회 실패'});
    }
    
});

app.listen(port, ()=>{
    console.log(`백앤드 서버 실행: http://localhost:${port}`);
});