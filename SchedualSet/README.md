# 💼 Leave Management System (LMS)

> **직원 연차 및 휴가 관리를 위한 웹 기반 솔루션**

본 프로젝트는 직원의 휴가 신청, 잔여 연차 계산, 관리 기능이 통합된 어드민급 휴가 관리 시스템입니다. React + Node.js 기반으로 구성되었으며, 연차 자동 계산 및 모달 기반 UI로 직관적인 사용성을 제공합니다.

---

## 🚀 주요 기능

### ✅ 사용자 기능
- 사용자 등록, 로그인
- 본인의 휴가 신청 (기간 지정 가능)
- 본인의 휴가 목록 조회 및 삭제
- 로그인 상태 유지 (localStorage)
- 남은 연차 자동 계산 및 차감
- 연도 변경 시 연차 이월 관리 준비중

### 🔐 인증
- `ProtectedRoute`를 통해 비로그인 사용자의 접근 제한
- 로그인 여부에 따라 버튼/페이지 접근 제어

### 📅 휴가 캘린더
- FullCalendar 기반
- 휴가 등록 시 자동 반영
- 본인 휴가 클릭 시 모달 오픈 → 삭제 가능

### 📊 연차 관리 로직
- 입사일 기준 1년 미만은 매월 1일 생성
- 1년 이상은 매년 15일 연차 자동 부여
- 사용 연차에 따라 잔여 연차 실시간 차감

---

## 🧱 프로젝트 구조

```bash
📁 client/              # React 프론트엔드
  ├─ page/
  │   ├─ LoginPage.tsx
  │   ├─ RegisterPage.tsx
  │   ├─ VacationCalendar.tsx
  │   ├─ UserInfoPage.tsx
  ├─ routes/
  │   └─ ProtectedRoute.tsx
  ├─ components/
  │   └─ Modal.tsx        # 재사용 가능한 모달 컴포넌트
  └─ App.tsx              # 라우팅 설정

📁 server/              # Node.js 백엔드
  ├─ routes/
  │   ├─ users.js
  │   ├─ vacation.js
  │   └─ leaveBalance.js
  ├─ service/
  │   └─ leaveService.js  # 연차 계산 로직 포함
  └─ db.js               # DB 연결


---

## 🧠 핵심 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React, TypeScript, Axios, FullCalendar |
| 백엔드 | Node.js, Express, MySQL (MariaDB), mysql2 |
| 인증 | localStorage 기반 인증 유지 |
| 상태관리 | useState, useEffect |
| UI 요소 | 재사용 가능한 Modal 컴포넌트 |
| 스타일링 | inline CSS + 레이아웃 구조화 |

---

## 🔄 향후 기능 확장 계획

- 🛡️ **JWT 인증 및 토큰 기반 보안 강화**
- 🧑‍💼 **관리자 페이지 (Admin Dashboard)**: 직원 연차 수동 조정, 휴가 신청 승인/거절
- 📋 **연차 이력 관리 (leave_history)**: 연도별 소멸 기록 저장
- 🕒 **휴가 시간 단위 신청** (시간 단위 연차)
- 📬 **신청 시 이메일 알림 기능**
- 📈 **통계 페이지**: 월별 연차 소진율 시각화
- 🌍 **다국어 지원 (i18n)**

---

## 📦 확장 작업 내역

| 구분 | 기능 | 설명 |
|------|------|------|
| ✅ 백엔드 연차 계산 | `calculateLeave()` | 입사일 기준 연차 계산 로직 적용 |
| ✅ 연차 차감/복구 | `deductLeave()` / `restoreLeave()` | 휴가 등록/삭제 시 연차 자동 처리 |
| ✅ 연차 일수 계산 | `calculateUsedDays()` | 시작일 ~ 종료일 간 휴가일 수 계산 |
| ✅ 테이블 추가 | `leave_balances`, `leave_history` | 연차 잔여량, 소멸 기록 저장용 테이블 |
| ✅ 유저 조인 기준 연차 부여 | DB join_date 기준 처리 |
| ✅ 모달 분리 컴포넌트 | `Modal.tsx` | 휴가 상세 삭제용 모달 분리 구현 |
| ✅ 권한 검증 | 본인 휴가만 삭제 가능, 관리자 확장 예정 |
| ✅ 캘린더 삭제 반영 | 삭제 후 캘린더 자동 업데이트 |

---

## ⚙️ 실행 방법

### 1. 백엔드 실행
```bash
cd server
npm install
node index.js
