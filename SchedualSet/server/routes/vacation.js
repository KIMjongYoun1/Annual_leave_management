const express = require('express');
const pool = require('../db');
const router = express.Router();
const { deductLeave, restoreLeave, calculateUsedDays } = require('../service/leaveService');

router.post('/', async(req, res)=>{
    const { user_id,name, title, start_date, end_date, leave_type} = req.body;
   try{
    

    if(!start_date || !end_date) {
        return res.status(404).json({message: "날짜가 올바르지 않습니다"});
    }
    const usedDays = leave_type === '반차' ? 0.5 : calculateUsedDays(start_date,end_date, leave_type);
    const [[balance]] = await pool.execute(
        'SELECT remaining_days FROM leave_balances WHERE user_id = ?', [user_id]
    );
    

    if (!balance || balance.remaining_days < usedDays){
        return res.status(400).json({message: "잔여 연차 부족"});
    }

    const [result] = await pool.execute(
    'INSERT INTO vacations (user_id,title,start_date, end_date, name, leave_type) VALUES (?,?,?,?,?,?)',
    [user_id, title, start_date, end_date, name, leave_type]);
    console.log(usedDays);
    console.log(req.body);

    await deductLeave(pool, user_id, usedDays);

    res.status(201).json({message : '휴가 등록 성공', id: result.insertId});
    console.log('📥 저장될 값:', { user_id, name, title, start_date, end_date, leave_type,usedDays });
    console.log('차감될 일수:', usedDays);

} catch (err){
    
    res.status(500).json({error: '등록 실패'});
    console.error('휴가 등록 실패', err)
   }
});

router.get('/user/:id', async(req,res) =>{
    const userId = req.params.id;
    try{
    const [rows] = await pool.execute(
        'SELECT * FROM vacations WHERE user_id = ?', [userId]
    );
    res.json(rows);
    } catch (err) {
        console.error('휴가조회 실패',err);
        res.status(500).json({error : '휴가조회 실패'});
    } 
});

router.delete('/:id', async(req,res)=>{
    const { id }=req.params;

    try {

        const [[vacation]] = await pool.execute(
            'SELECT user_id FROM vacations WHERE vacation_id = ?', [id]
        );
        if (!vacation) {
            return res.status(404).json({message: '휴가정보가 존재하지않습니다'});
        }
        const [result] = await pool.execute(
            'DELETE FROM vacations WHERE vacation_id = ?',[id]
        );
        if(result.affectedRows === 0){
            return res.status(404).json({message: '해당휴가가 존재하지 않습니다.'});
        }
        const usedDays = calculateUsedDays(vacation.start_date, vacation.end_date);
        await restoreLeave(pool, vacation.user_id, usedDays);
        
        return res.status(200).json({message: '삭제성공'});
        
    } catch (err) {
        console.error('삭제실페',err);
        res.status(500).json({message: '서버오류'});
    }
});

module.exports = router;