const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const [row] = await pool.execute(
            'SELECT user_id, user_name, department, position, role FROM users'
        ); res.json(rows);
        console.log('사용자' : rows);
    } catch (err) {
        console.error('전체사용자 조회 실패', err);
        res.status(500).json({ error: '서버오류' });
    }
});

router.put('/users/:id/role', async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE user SET role = ? WHERE user_id = ?'
            , [role, user_id]
        );
        res.json({ message: '권한변경 성공' });
    } catch (err) {
        console.error('권한변경 실패', err);
        res.status(500).json({ error: '서버오류' });
    }
});

module.exports = router;