// routes/details.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// [1] 수상 이력 조회 (특정 유저)
router.get('/api/awards/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM awards WHERE user_id = ? ORDER BY award_date DESC', [user_id]);
        res.json(rows);
    } catch (err) {
        console.error('조회 실패:', err);
        res.status(500).send('수상 이력 조회 오류');
    }
});

// [2] 수상 이력 추가
router.post('/api/awards', async (req, res) => {
    const { user_id, title, description, award_date } = req.body;
    try {
        await pool.query(
            'INSERT INTO awards (user_id, title, description, award_date) VALUES (?, ?, ?, ?)',
            [user_id, title, description, award_date]
        );
        res.sendStatus(201);
    } catch (err) {
        console.error('추가 실패:', err);
        res.status(500).send('수상 이력 추가 오류');
    }
});

// [3] 수상 이력 수정
router.put('/api/awards/:award_id', async (req, res) => {
    const { award_id } = req.params;
    const { title, description, award_date } = req.body;
    try {
        await pool.query(
            'UPDATE awards SET title = ?, description = ?, award_date = ? WHERE award_id = ?',
            [title, description, award_date, award_id]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error('수정 실패:', err);
        res.status(500).send('수상 이력 수정 오류');
    }
});

// [4] 수상 이력 삭제
router.delete('/api/awards/:award_id', async (req, res) => {
    const { award_id } = req.params;
    try {
        await pool.query('DELETE FROM awards WHERE award_id = ?', [award_id]);
        res.sendStatus(200);
    } catch (err) {
        console.error('삭제 실패:', err);
        res.status(500).send('수상 이력 삭제 오류');
    }
});

module.exports = router;
