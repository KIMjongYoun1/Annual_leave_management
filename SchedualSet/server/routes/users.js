const express = require('express');
const pool = require('../db');
const router = express.Router();
// const cors = require('cors');
// const app = express();
// const port = 3001;

//미들웨어설정
// app.use(cors());
// app.use(express.json());



router.post('/register', async (req, res) => {
    const { userid, username, password, department, position } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO users (user_id, user_name, password, department, position) VALUES (?, ?, ?,?,?)',
            [userid, username, password, department, position]
        );
        res.status(201).json({ message: '회원가입 성공' });
    } catch (err) {
        console.error('가입 실패', err)
        res.status(500).json({ error: '가입실패', message: err.body });
    }
});

router.post('/login', async (req, res) => {
    const { userid, password } = req.body;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE user_id = ?',
            [userid]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: '아이디를 확인해주세요' });
        }

        const user = rows[0];

        if (user.password !== password) {
            return res.status(401).json({ mesaage: '비밀번호를 확인해주세요' });
        }

        res.status(200).json({
            message: 'SUCCES', user: {
                user_id: user.user_id,
                user_name: user.user_name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('로그인 실패', err);
        res.status(500).json({ message: '서버오류' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, user_name, department, position FROM users WHERE user_id = ?'
            , [req.params.id]
        );
        console.log('조회결과', rows);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ errpr: '유정 없음' });
        }
    } catch (err) {
        console.error('유저조회 실패', err);
        res.status(500).json({ error: '서버에러' });

    } });

module.exports = router;