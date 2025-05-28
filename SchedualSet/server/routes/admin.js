const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, user_name, department, position, role FROM users'
        ); res.json(rows);
        console.log('사용자', rows);
    } catch (err) {
        console.error('전체사용자 조회 실패', err);
        res.status(500).json({ error: '서버오류' });
    }
});

router.put('/users/:id/role', async (req, res) => {
    const userid = req.params.id;
    const { role } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE users SET role = ? WHERE user_id = ?'
            , [role, userid]
        );
        res.json({ message: '권한변경 성공' });
    } catch (err) {
        console.error('권한변경 실패', err);
        res.status(500).json({ error: '서버오류' });
    }
});

router.get('/vacations', async (req,res) =>{
    const { page = 1, size = 10, user_name, department, month} = req.query;
    const offset = (page - 1) * size;

    let query =  `SELECT v.*, u.user_name AS user_name, u.department
    FROM vacations v
    JOIN users u ON v.user_id = u.user_id
    WHERE 1=1`
  ;
    const params = [];

    if (user_name) {
        query += ' AND u.name LIKE ?';
        params.push(`%${user_name}%`);
    }

    if (department) {
        query += ' AND u.department = ?';
        params.push(department);
    }

    if (month) {
        query += ' AND DATE_FORMAT(v.start_date, "%Y-%m") = ?';
        params.push(month);
    }

    query += ' ORDER BY v.start_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(size), parseInt(offset));

    try {
        const [rows] = await pool.execute(query,params);
        res.json(rows);
    } catch (err) {
        console.error('전체 휴가 조회 실패', err);
        res.status(500).json({error : '서버오류'});
    }
});

module.exports = router;