export default function UserProfile({userInfo} : {userInfo : User | null}){
    if (!userInfo) return <p>유저 정보를 불러오는중...</p>

    return (
        <>
        <p>부서: {userInfo.department}</p>
        <p>직급: {userInfo.position}</p>
        <p>이름: {userInfo.user_name}</p>
        <p>아이디: {userInfo.user_id}</p>
        </>
    );
}