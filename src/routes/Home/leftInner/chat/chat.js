import Style from './chat.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getChattingListUrl,
    getChattingRoomNameUrl,
} from '../../../../apiUrl';
import axios from 'axios';
import { Temporal } from '@js-temporal/polyfill';
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
import userEvent from '@testing-library/user-event';

const SingleChat = ({data, setLeftBookState, userId}) => {
    //유저의 이미지나 이름을 클릭하면 해당 유저의 페이지로 이동한다. <---------------이동이 있는 곳!
    const goToThatUserPage = (event) => {
        event.preventDefault();
        setLeftBookState(`pList/${data.userDto.userId}`);
    };

    //시간 계산 함수
    /** claTime: 업로드된 시간. output: 안에 들어갈 문자열  */
    const calculateTimeFrom = (calTime) => {
        const now = Temporal.Now.plainDateTimeISO();//현재 시간 세팅
        const postedDate = Temporal.PlainDateTime.from(calTime);
        const result = now.since(postedDate);
        if(result.minutes === 0){//0분이내인 경우
            return "방금 전";
        }
        else if(result.hours === 0){//1시간보다는 아래인 경우
            return `${result.minutes}분 전`;
        }
        else if(result.days === 0){//1일보다는 아래인 경우
            return `${result.hours}시간 전`;
        }
        else if(result.months === 0){//1달보다는 아래인 경우
            return `${result.days}일 전`;
        }
        else if(result.years === 0){//1년보다는 아래인 경우
            return `${result.months}달 전`;
        }
        else{//1년 이상인 경우
            return `${result.years}년 전`;
        }
    };

    return(
        <div className={userId !== data.userDto.userId ? Style.singleOtherChattingArea : Style.singleMyChattingArea}>            
            {/* 유저의 프로필 이미지가 오는 곳 */
                userId !== data.userDto.userId ?
               <img src={data.userDto.imgUrl} className={Style.chatUserimg} onClick={goToThatUserPage}/> : null
            }
            <div className={Style.userchatFlexBox}>
                {/* 유저의 이름이 오는 곳 */
                    userId !== data.userDto.userId ?
                    <p className={Style.chatuserName} onClick={goToThatUserPage}>{data.userDto.nickname}</p> : null
                }
                {/* 유저의 채팅 내용이 오는 곳 */}
                <div className={Style.chattingText} style={userId !== data.userDto.userId ? null : {backgroundColor: "#F4DEDE"}}>{data.message}</div>
                <p className={Style.chatTime}>{calculateTimeFrom(data.createdDate)}</p>
            </div>
        </div>
    );
};

const LeftChat = ({refreshAccessToken, leftBookState, setLeftBookState, userId}) => {
    const [chattingRoomId, setChattingRoomId] = useState(-1);//채팅방의 id
    const [chattingRoomName, setChattingRoomName] = useState("채팅방의 이름이 오는 자리입니다.");//채팅방 이름
    const [chattingList, setChattingList] = useState([
        {
            "userDto": {
                "userId": 2,
                "nickname": "user2",
                "imgUrl": null
            },
            "message": "ㅎㅇㅎㅇ",
            "createdDate": "2022-10-13T18:40:42.110228"
        },
        {
            "userDto": {
                "userId": 1,
                "nickname": "user1",
                "imgUrl": null
            },
            "message": "안녕하세요. 글이 겁나게 길어졌을 때 자동으로 줄 바꿈 되고 줄 바꿈 하면서 height도 그에 맞게 길어지는지 확인 일단 자동으로 줄 바꿈은 되는데 과연 높이도 달라질것인가 달라지는데 이게 이상하게 중앙에 맞춰지는구나 이게 지금 되고있는건가 아닌건가 아아아아아아아아아아아아 되나 이것도? 오 되는거 같다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
            "createdDate": "2022-10-13T18:39:55.867396"
        }
    ]);//채팅방의 채팅들
    const [chattingListStartId, setChattingListStartId] = useState(987654321);//채팅방의 채팅을 불러오는 startId
    const [oldestChat, inView] = useInView();//가장 오래된(가장 위의) 채팅에게 값을 넣으면 inView값 변경

    const [userChatInput, setUserChatInput] = useState("");//사용자의 채팅 내용
    const [stompClient, setStompClient] = useState(null);//소켓 연결이 된 친구

    const onUserChattingChangeHandler = (event) => {
        setUserChatInput(event.target.value);
    };

    const onUserChattingEnterClickHandler = (event) => {
        if(event.keyCode === 13){//엔터 입력 시
            event.preventDefault();
            userChattingSubmitHandler(null);
        }
    }

    //소켓 설정해주는 함수
    const socketConnect = () => {
        const socket = new SockJS("https://api.cleanbook.site/ws");
        const tmp = Stomp.over(socket);
        setStompClient(tmp);
    };

    if(stompClient !==null){
        stompClient.connect({}, function (frame) {
            console.log(frame);
            stompClient.subscribe(`https://api.cleanbook.site/sub/${chattingRoomId}`, function (chatMessage) {//구독
                console.log("받아지고 있는거야?");
                const tmp = [...chattingList];
                tmp.push(JSON.parse(chatMessage.body));
                setChattingList(tmp);
            });
        });
    }

    //가장 먼저 채팅방의 아이디를 가져온다.
    const presetChattingRoomId = () => {
        setChattingRoomId(leftBookState.split('/')[1]);
    }
    useEffect(presetChattingRoomId, [leftBookState]);//초기 실행 - leftBookState가 바뀌면 실행한다.

    //id가 주어졌을 때 이제 해당 채팅방의 채팅들을 불러오고 소캣을 연결한다.
    const presetChattingList = () => {
        if(chattingRoomId === -1) return;//초기상황에서는 그냥 종료
        axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
        .then((res) => {
            const cur = [...chattingList];//지금의 채팅방 채팅 리스트
            const tmp = [...res.data.data];//받아온 채팅방 채팅 리스트
            const next = cur.concat(tmp);
            setChattingList(next);
            setChattingListStartId(res.data.startId);
            axios.get(`${getChattingRoomNameUrl}/${chattingRoomId}/name`)
            .then((res) => {
                setChattingRoomName(res.data.data.chatroomName);
                socketConnect();//소캣 연결까지 완료한다.
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    alert("채팅방의 이름을 불러오지 못했습니다.");
                }
            });
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                alert("채팅을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetChattingList, [chattingRoomId]);//채팅방 아이디를 가져오면 진행

    //채팅 제출함수<-----------------------------여기 바꿔야함
    const userChattingSubmitHandler = (event) => {
        if(event !== null) {//이벤트가 submit일 수도 있고 그냥 엔터눌러서 온 걸 수도 있다. 엔터면 그냥 넘어가고 submit이면 preventDefault()한다.
            event.preventDefault();
        }
        if(userChatInput === "") return;//입력한게 없으면 제출 X
        
        const now = new Date();

        stompClient.send(`https://api.cleanbook.site/pub/${chattingRoomId}`, {},
            JSON.stringify({
                userDto:{
                    userId: 5,
                    nickname: "testing",
                    imgUrl: null
                },
                message: userChatInput,
                createdDate : now,
            })
        );
    };

    return(
        <div className={Style.wholeCover}>
            <form className={Style.chattingRoomNameArea}>
                <input 
                    className={Style.chattingRoomName}
                    value={chattingRoomName}
                    disabled={true}
                />
            </form>
            <div className={Style.chattingListArea}>
                <div className={Style.chattingListAreaSize}>
                    {
                        chattingList.map((data, index) => (
                            <SingleChat data={data} key={index} setLeftBookState={setLeftBookState} userId={userId}/>
                        ))
                    }
                </div>
            </div>
            <form className={Style.userChatArea} onSubmit={userChattingSubmitHandler}>
                <textarea 
                    className={Style.userChatInput}
                    value={userChatInput}
                    onKeyDown={onUserChattingEnterClickHandler}
                    onChange={onUserChattingChangeHandler}
                />
                <div className={Style.userChatBtnArea}>
                    <button className={Style.userChatBtn}>제출</button>
                </div>
            </form>
        </div>
    );
}

export default LeftChat;