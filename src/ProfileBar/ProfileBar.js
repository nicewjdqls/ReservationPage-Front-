import { FaUserCircle } from "react-icons/fa";
import { CPopover, CButton, CAvatar } from '@coreui/react'

function ProfileBarPage(props) {

    // 로그아웃 버튼 구성
    const logoutButton = (
        <CButton 
            className="p-button" 
            onClick={() => {
                const userId = localStorage.getItem("id");
                if (userId) {
                    alert(userId + '가 로그아웃 되었습니다.');
                }
                props.onLogout();
            }}
        >
            로그아웃
        </CButton>
    );

    // 사용자 이름의 첫 글자 가져오기
    const userName = localStorage.getItem("name");
    const avatarText = userName ? userName[0] : "U"; // 기본값 "U" 설정

    return (
        <main className="profile-page">            
            <CPopover
                content={logoutButton}
                placement="bottom"
                title="내 정보"
                trigger="focus"
            >
                <CButton className="profile-badge" shape="rounded-pill">
                    <CAvatar color="success" textColor="white">
                        {avatarText}
                    </CAvatar>
                    {/* <FaUserCircle size={30}>안</FaUserCircle> */}
                </CButton>
            </CPopover>
        </main>
    );
}

export default ProfileBarPage;
