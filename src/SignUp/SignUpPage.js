import { useState } from 'react';
import api from '../api/api';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale/ko";
import { 
    CButton, CForm, CFormFloating, CFormInput, CFormLabel, 
} from '@coreui/bootstrap-react';
import { PiSealCheckFill } from "react-icons/pi";

function SignUpPage(props) {
    const [show, setShow] = useState(false);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwCheck, setPwCheck] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //input태그에서 id값 받아옴
    const getId = (e) => setId(e.target.value);

    //input태그에서 pw값 받아옴
    const getPw = (e) => setPw(e.target.value);

    //input태그에서 pwCheck값 받아옴
    const getPwCheck = (e) => setPwCheck(e.target.value);

    //input태그에서 name값 받아옴
    const getName = (e) => setName(e.target.value);

    //input태그에서 phone값 받아옴
    const getPhone = (e) => setPhone(e.target.value);

    //서버로 보낼 로그인 데이터
    const data = {
        "user_id": id,
        "user_pw": pw,
        "user_name": name,
        "user_phone": phone,
        "user_birthDate": selectedDate
    };

    //회원가입 데이터 전송 함수(axios post)
    const reqSignUp = () => api.post('/api/signUp', data)
    .then(res => {
        //중복 아닐 때
        if (res.data.success) {
            handleShow();        
        } else {
            alert('회원가입에 실패했습니다.');
        }
        console.log(res, data);
        
    }).catch(err => {
        alert("회원가입 요청에 실패했습니다.");
        console.log(err);
    });

    //아이디 중복체크 전송 함수(axios get)
    const checkId = () => {
        api.get(`/api/signUp/checkId/${id}`)
        .then(res => {
            if (res.data.success) {
                alert("사용 가능한 아이디입니다.");
            } else {
                alert("이미 사용중인 아이디입니다.");
            }
        }).catch(err => {
            console.error("중복 확인 실패:", err);
            alert("아이디 중복 확인에 실패했습니다.");
        });
    };

    return (
        <main className="signup-page">
            <div className="login-logo"></div>

            <CForm className="signup-form">

                {/* 아이디 입력 */}
                <CFormFloating className="mb-3">
                    <CFormInput type="text" id="floatingId" value={id} onChange={getId} placeholder="abcd1234" />
                    <CFormLabel htmlFor="floatingId">아이디입력 (6 - 20자)</CFormLabel>
                    <CButton onClick={checkId} className="p-button-sm mt-2" type="button">중복 확인</CButton>       
                </CFormFloating>

                {/* 비밀번호 입력*/}
                <CFormFloating className="mb-3">
                    <CFormInput type="password" id="floatingPassword" value={pw} onChange={getPw} placeholder="password"/>
                    <CFormLabel htmlFor="floatingPassword">비밀번호 입력(문자,숫자,특수문자 포함 8-20자)</CFormLabel>
                </CFormFloating>

                {/* 비밀번호 재입력*/}
                <CFormFloating className="mb-3">
                    <CFormInput type="password" id="floatingPassword" value={pwCheck} onChange={getPwCheck} placeholder="password"/>
                    <CFormLabel htmlFor="floatingPassword">비밀번호 재입력</CFormLabel>
                </CFormFloating>

                {/* 이름 입력*/}
                <CFormFloating className="mb-3">
                    <CFormInput type="text" id="floatingName" value={name} onChange={getName} placeholder="name"/>
                    <CFormLabel htmlFor="floatingName">이름 입력</CFormLabel>
                </CFormFloating>

                {/* 휴대폰번호 입력*/}
                <CFormFloating className="mb-3">
                    <CFormInput type="text" id="floatingPhone" value={phone} onChange={getPhone} placeholder="phone"/>
                    <CFormLabel htmlFor="floatingPhone">휴대폰 번호 입력 (“-” 제외 11자리 입력)</CFormLabel>
                </CFormFloating>

                {/* 생년월일 입력 */}
                <CFormFloating className="date-form">
                <DatePicker
                    locale={ko}
                    className="date-picker"
                    dateFormat='yyyy년 MM월 dd일' // 날짜 형태
                    placeholderText="생년월일 입력"
                    shouldCloseOnSelect // 날짜를 선택하면 datepicker가 닫히는지 여부
                    selected={selectedDate} // 날짜를 선택했을 때의 상태
                    onChange={(date) => setSelectedDate(date)} // 날짜 선택 핸들러
                    maxDate={new Date()} // 현재 날짜 이후로는 선택 불가
                />
                </CFormFloating>

                {/* 버튼 클릭시 서버에 회원가입 정보 전송 */}
                <CButton onClick={reqSignUp} className="mt-4" type="button">회원가입</CButton>

            </CForm>

            {/* 회원가입 성공 모달 */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>회원가입 완료</Modal.Title>
                </Modal.Header>
                <Modal.Body>회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={() => window.location.href = '/login'}>
                    로그인 페이지로
                </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
}

export default SignUpPage;
