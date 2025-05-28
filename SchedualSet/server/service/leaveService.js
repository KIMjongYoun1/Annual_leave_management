// 휴가 계산 함수
function calculateLeave(joinData, usedDays = 0) {
    const today = new Date();
    const join = new Date(joinData);

    const oneYearLater = new Date(join);
    oneYearLater.setFullYear(join.getFullYear() + 1);

    let earned = 0;

    if (today < oneYearLater) {
        // 1년 미만 → 매달 1일씩
        const monthsDiff =
            (today.getFullYear() - join.getFullYear()) * 12 +
            (today.getMonth() - join.getMonth());
        earned = Math.min(monthsDiff, 11); // 11개월까지 인정 (1개월은 수습기간 등 제외)
    } else {
        // 1년 이상 → 연 15일 + 3년차부터 2년에 1일씩 추가
        const fullYears = today.getFullYear() - join.getFullYear();
        earned = 15;

        const joinMonthDay = join.getMonth() * 100 + join.getDate();
        const todayMonthDay = today.getMonth() * 100 + today.getDate();

        // 입사일이 아직 도래하지 않았으면 올해는 이전 해 기준
        if (todayMonthDay < joinMonthDay) {
            fullYears -= 1;
        }

        const extraYears = Math.floor((fullYears - 2) / 2);
        if (extraYears > 0) {
            earned += Math.min(extraYears, 5); // 최대 25일까지 제한
        }
    }

    const remaining = earned - usedDays;
    return { earned, used: usedDays, remaining };
}

// 사용일 계산함수
function calculateUsedDays(start, end, leave_type = 'Annual'){
    if (leave_type === 'Half') return 0.5;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
    const totalDays = Math.floor(diffDays) + 1;
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