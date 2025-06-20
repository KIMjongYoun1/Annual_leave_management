const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middlewares/upload');

// 받은 메일
router.get('/inbox/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM mails WHERE to_id = ? ORDER BY DESC', [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('받은 메일 조회 실패', err);
        res.status(500).json({ error: '서버오류' });
    }
});

// 보낸 메일
router.get('/sent/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM mails WHERE from_id = ? ORDER BY DESC', [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('보낸 메일 조회 실패', err);
        res.status(500).json({ error: '서버오류' });
    }

});

// 메일 보내기
router.post('/', upload.array('files'), async (req, res) => {
    const { from_id, to_id, title, content } = req.body;
    const files = req.files;

    try {
        const [result] = await pool.execute(
            `INSERT INTO mails (from_id, to_id, title, content, sent_at) VALUES (?, ?, ?, ?, NOW())`,
            [from_id, to_id, title, content]
        );

        const mailId = result.insertId

        if (files && files.length > 0) {
            const values = files.map(file => [
                mailId,
                file.originalname,
                file.path
            ]);
            await pool.query(
                `INSERT INTO mail_attachments (mail_id, file_name, file_path) VALUES ?`, [values]
            );
        }

        res.json({ success: true, mail_id: mailId });

    } catch (err) {
        console.error('메일 전송 실패', err);
        res.status(500).json({ error: '메일 전송중 서보 오류' });
    }
});

// 메일 상세내역 조회
router.get('/:mailId', async (req,res) => {
    const { mailId } = req.params;

    try {
        const [mails] = await pool.execute(
            `SELECT mail_id, from_id, to_id, title, content, sent_at
            FROM mails WHERE mail_id = ?`, [mailId]
        );

        if ( mails.length === 0) {
            return res.status(404).json({error:'메일이 존재하지 않습니다'});
        }

        // ㅊ첨부파일 조회
        const [attachments] = await pool.execute(
            `SELECT file_name, file_path
            FROM mail_attachments WHERE mail_id = ?`, [mailId]
        );

        // 첨부파일명만 배열로 추출

        const mail = mails[0];
        mail.attachment = attachments.map(att => ({
            file_name: att.file_name,
            file_url: `/api/mails/download/${att.file_path.split('/').pop()}`
          }));
          

        res.json(mails);

    } catch (err) {
        console.error('메일 상세조회 실패', err);
        res.status(500).json({error: '메일서버 오류'});
    }
});