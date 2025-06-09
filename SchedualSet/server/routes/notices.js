const express = require('express');
const router = express.Router();
const pool = require('../db');

//[1] 전체 공지 조회
router.get('/api/notices', async (req,res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('공지조회 실패', err);
        res.status(500).json({ error: '공지사항 조회 오류'});
    }
});

// [2] 특정 공지 상세 조회
router.get('/api/notices/:id', async (req,res)=>{
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM notices WHERE notice_id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        console.error('공자 상세 조회 실패', err);
        res.status(500).send('공지 상세 조회 실패');
    }
});

// [3] 공지 작성
router.post('/api/notices', async(req,res) => {
    const { author_id, title, content, category } = req.body;
    try {
        await pool.query(
            'INSERT INTO notices (author_id, title, content, category) VALUES ( ?, ? ,? ,?)',
             [author_id, title, content, category ]
        );
        res.status(201).json({ message : '공지 작성 완료'});
    } catch (err) {
        console.error('공지 작성 실패', err);
        res.status(500).send('공지 작성 실패');
    }
});

// [4] 공지 수정
router.put('/api/notices/:id', async(req,res) => {
    const { id } = req.params;
    const { title, content, category} = req.body;

    try {
        await pool.query(
            'UPDATE notices SET title =?, content = ?, category =? WHERE notice_id = ?',
            [title, content, category, id]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error('공지 수정 실패', err);
        res.status(500).send('공지 수정 오류');
    }
});

// [5] 공지 삭제
router.delete('/api/notices/:id', async(req,res) => {
    const {id } = req.params;
    try {
        await pool.query(
            'DELETE FROM notices WHERE notice_id = ?', [id]);
            res.status(200).json({message: '공지 삭제 완료'});
    } catch (err) {
        console.error('공지 삭제 실패', err);
        res.status(500).send('공지 삭제 실패');
    }
});

//[6] 공지검색
router.get('/api/notices/search', async (req,res) => {
    const { title } = req.params
    try {
        const [rows] = await pool.query(
            `SELECT * FROM notices WHERE title LIKE ? ORDER BY created_at DESC`,
            [`%${title}`]
        );
        res.json(rows);
    } catch (err) {
        console.error('검색 식패', err);
        res.status(500).json({ error: '검색 오류'});
    }
});

module.exports = router;