// 휴가 계산 함수
function calculateLeave(joinData, usedDays = 0) {
    const today = new Date();
    const join = new Date(joinData);
    
    const yearsDiff = today.getFullYear() - join.getFullYear();
    const monthsDiff = (today.getFullYear() - join.getFullYear()) * 12 + (today.getMonth() - join.getMonth());

    let earned = 0;
    if (yearsDiff < 1) {
        earned = monthsDiff;
    } else {
        earned = 15 * yearsDiff;
    }

    const remaining = earned - usedDays;
    return { earned, used: usedDays, remaining};
}

// 사용일 계산함수
function calculateUsedDays(start, end){
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
}

async function deductLeave(pool, userId, usedDays) {
    await pool.execute(
       `UPDATE leave_balances
        SET used_days = used_days + ?,
            remaining_days = remaining_days - ?,
            last_updated = NOW()
            WHERE user_id = ?`, [usedDays, usedDays, userId]
    );
    
}

async function restoreLeave(pool, userId, usedDays) {
    await pool.execute(
        `UPDATE leave_balances
         SET used_days = used_days - ?,
         remaining_days = remaining_days + ?,
         last_updated = NOW()
         WHERE user_id = ?`, [usedDays, usedDays, userId]
    )
    
}

module.exports = { calculateLeave, deductLeave, restoreLeave, calculateUsedDays };