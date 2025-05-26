const express = require('express');
const router = express.Router();
const pool = require('../db');
const { calculateLeave } = require('../service/leaveService');

router.get('/:userId', async (req,res) => {
    const { userId } = req.params;
    const currentYear = new Date().getFullYear();
    try {
        const [[user]] = await pool.execute('SELECT join_date FROM users WHERE user_id = ?', [userId]);
        if (!user || !user.join_date){
            return res.status(404).json({message: '유저정보가 없습니다'});
        }

        const [vacations] = await pool.execute('SELECT * FROM vacations WHERE user_id = ?', [userId]);
        const used = vacations.reduce((acc, v) => {
            const start = new Date(v.start_date);
            const end = new Date(v.end_date);
            const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
            return acc + diff;
        }, 0);
        const leaveInfo = calculateLeave(user.join_date, used);

        const [exists] = await pool.execute(
            'SELECT * FROM leave_balances WHERE user_id = ? AND year = ?',[userId, currentYear]
        );

        if (exists.length === 0){
            await pool.execute(
                `INSERT INTO leave_balances
                (user_id, earned_days, used_days, remaining_days, last_updated, year)
                VALUES (?, ?, ?, ?, NOW(), ?)`,[userId, leaveInfo.earned, leaveInfo.used, leaveInfo.remaining, currentYear]
            );
         } else {
                await pool.execute(
                    `UPDATE leave_balances SET
                    earned_days = ?, used_days = ?, remaining_days = ?, last_updated = NOW()
                    WHERE user_id = ? AND year = ?`,
                    [leaveInfo.earned, leaveInfo.used, leaveInfo.remaining, userId, currentYear]
                );
            }
        

        res.json(leaveInfo);
    } catch (err) {
        console.error('휴가계산 실패', err);
        res.status(500).json({message: '휴가계산실패'});
    }
});

module.exports = router;