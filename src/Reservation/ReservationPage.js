import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationPage = () => {
    const [roomOptions, setRoomOptions] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');

    // 로그인된 사용자 정보를 가져와서 state에 저장
    useEffect(() => {
        const storedId = localStorage.getItem('id'); // 로그인 시 저장한 사용자 ID
        const storedName = localStorage.getItem('name'); // 로그인 시 저장한 사용자 이름

        if (!storedId) {
            alert('로그인 정보가 없습니다. 로그인해주세요.');
            // 로그인 페이지로 리다이렉트할 수 있습니다.
        } else {
            setUserId(storedId);
            setUserName(storedName);
        }
    }, []);

    useEffect(() => {
        // 방 옵션 가져오기
        axios.get('http://localhost:5000/api/room-options')
            .then(response => {
                setRoomOptions(response.data);
            })
            .catch(error => {
                console.error('방 옵션 가져오기 오류:', error);
            });
    }, []);

    const handleReserve = () => {
    if (!selectedRoom || !startTime || !endTime) {
        alert('모든 필드를 채워주세요.');
        return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
        alert('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
    }

    const data = {
        room_number: selectedRoom,
        start_time: startTime,
        end_time: endTime,
        user_id: userId
    };

    console.log('예약 요청 데이터:', data); // 요청 데이터 로그

    axios.post('http://localhost:5000/api/reserve-room', data)
        .then(response => {
            console.log('서버 응답:', response); // 응답 데이터 로그
            if (response.status === 200) {
                alert('예약 성공!');
                setSelectedRoom('');
                setStartTime('');
                setEndTime('');
            } else {
                alert('예약 실패! 응답 상태 코드: ' + response.status);
            }
        })
        .catch(error => {
            console.error('예약 오류:', error);
            alert('예약 실패! 오류 메시지: ' + error.message);
        });
};
    return (
        <div>
            <h1>방 예약 페이지</h1>

            {/* 로그인된 사용자 정보 표시 */}
            <div>
                <p>환영합니다, {userName}님!</p>
                <p>로그인된 사용자 ID: {userId}</p>
            </div>

            <div>
                <label>방 옵션:</label>
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                    <option value="">선택하세요</option>
                    {roomOptions.map(option => (
                        <option key={option.room_number} value={option.room_number}>
                            {option.type} ({option.room_number})
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>시작 시간:</label>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
                <label>종료 시간:</label>
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <button onClick={handleReserve}>예약하기</button>
        </div>
    );
};

export default ReservationPage;
