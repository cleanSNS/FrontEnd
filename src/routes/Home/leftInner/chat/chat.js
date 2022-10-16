import Style from './chat.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getChattingListUrl,
    getChattingRoomNameUrl,
    getUserNicknameAndImageUrl,
} from '../../../../apiUrl';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';

const SingleChat = ({data, setLeftBookState, userId, oldestChat}) => {
    //유저의 이미지나 이름을 클릭하면 해당 유저의 페이지로 이동한다. <---------------이동이 있는 곳!
    const goToThatUserPage = (event) => {
        event.preventDefault();
        setLeftBookState(`pList/${data.userDto.userId}`);
    };

    //시간 계산 함수
    /** claTime: 업로드된 시간. output: 안에 들어갈 문자열  */
    const calculateTimeFrom = (calTime) => {
        const postedTime = JSON.parse(calTime);
        const now = new Date();
        if(postedTime.getFullYear() === now.getFullYear() &&postedTime.getMonth() === now.getMonth() && postedTime.getDate() === now.getDate()){//연,월,일이 오늘이면, 시간과 분을 쓰고,
            return `${postedTime.getHours()} : ${postedTime.getMinutes()}`;
        }
        else{//연월일이 오늘이 아니면 월 일을 쓴다.
            return `${postedTime.getMonth()}월 ${postedTime.getDate()}일`;
        }
    };

    return(
        <div className={userId !== data.userDto.userId ? Style.singleOtherChattingArea : Style.singleMyChattingArea} ref={oldestChat}>            
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
    const [chattingList, setChattingList] = useState([]);//채팅방의 채팅들
    const [chattingListStartId, setChattingListStartId] = useState(987654321);//채팅방의 채팅을 불러오는 startId
    const [oldestChat, inView] = useInView();//가장 오래된(가장 위의) 채팅에게 값을 넣으면 inView값 변경
    const [isFirstChat, setIsFirstChat] = useState(false);//가장 오래된 채팅이 로드되면 값을 true로 변경. 더 이상 로드할게 없다.
    const [userChatInput, setUserChatInput] = useState("");//사용자의 채팅 내용
    const [stompClient, setStompClient] = useState(null);//소켓 연결이 된 친구
    const [myuserImgUrl, serMyUserImgUrl] = useState("");//내 이미지
    const [myuserNickname, setMyUserNickname] = useState("");//내 이름

    const [newChat, setNewChat] = useState("");//새로운 채팅을 불러오는 부분

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

    //소켓이 추가되면 그에 맞는 함수를 추가하는 함수
    useEffect(() => {
        if(stompClient === null) return; //초기 상황에는 그냥 종료
        stompClient.connect({}, function (frame) {
            stompClient.subscribe(`/sub/${chattingRoomId}`, function (chatMessage) {//구독
                let tmpchat = chatMessage.body;
                tmpchat = JSON.parse(tmpchat);
                console.log(tmpchat);//지우기
                console.log("새로 불러왔습니다.");//지우가
                setNewChat(tmpchat);
            });
            stompClient.send(`/pub/${chattingRoomId}`, {}, JSON.stringify({ sender: userId, type: "JOIN" }));//이거 필요한지 확인 필요
        });
    }, [stompClient]);

    //새로운 채팅이 들어왔을 때 반영하는 함수
    useEffect(() => {
        if(newChat === "") return;//초기 상황에는 그냥 종료
        const tmp = [...chattingList];
        tmp.push(newChat);
        setChattingList(tmp);
    }, [newChat]);

    //가장 먼저 채팅방의 아이디를 가져온다.
    const presetChattingRoomId = () => {
        setChattingRoomId(leftBookState.split('/')[1]);
    }
    useEffect(presetChattingRoomId, [leftBookState]);//초기 실행 - leftBookState가 바뀌면 실행한다.

    //채팅이 추가되면 자동으로 스크롤 해주는 함수
    useEffect(() => {
        document.querySelector("#chatbox").scrollTop = document.querySelector("#chatbox").scrollHeight;
    }, [chattingList]);

    //id가 주어졌을 때 이제 해당 채팅방의 채팅들을 불러오고 소캣을 연결한다.
    const presetChattingList = () => {
        if(chattingRoomId === -1) return;//초기상황에서는 그냥 종료
        axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
        .then((res) => {
            const cur = [...chattingList];//지금의 채팅방 채팅 리스트
            const tmp = [...res.data.data];//받아온 채팅방 채팅 리스트
            if(tmp.length === 0){
                setIsFirstChat(true);
                return;
            }
            const next = cur.concat(tmp);
            setChattingList(next);
            setChattingListStartId(res.data.startId);
            axios.get(`${getChattingRoomNameUrl}/${chattingRoomId}/name`)
            .then((res) => {
                setChattingRoomName(res.data.data.chatroomName);
                axios.get(`${getUserNicknameAndImageUrl}${userId}/profile`)
                .then((res) =>{
                    serMyUserImgUrl(res.data.data.imgUrl);
                    setMyUserNickname(res.data.data.nickname);
                    socketConnect();//소캣 연결까지 완료한다.
                })
                .catch((res) => {
                    if(res.response.status === 401){
                        refreshAccessToken();
                    }
                    else{
                        alert("내 프로필을 불러오지 못했습니다.");
                    }
                })
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
        
        const nowT = new Date();
        const now = JSON.stringify(nowT);
        stompClient.send(`/pub/${chattingRoomId}`, {sender: userId},
            JSON.stringify({
                userDto:{
                    userId: userId,
                    nickname: myuserNickname,
                    imgUrl: myuserImgUrl
                },
                message: userChatInput,
                createdDate : now,
            })
        );
        setUserChatInput("");
    };

    //무한 로딩 함수 - 작동 확인함
    useEffect(() => {
        console.log("일단 무한 로딩이 실행되는가?")
        console.log(inView);
        console.log(isFirstChat);
        if(inView && !isFirstChat){
            axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
            .then((res) => {
                const cur = [...chattingList];//지금의 채팅방 채팅 리스트
                const tmp = [...res.data.data];//받아온 채팅방 채팅 리스트
                if(tmp.length === 0){
                    setIsFirstChat(true);
                    return;
                }
                const next = cur.concat(tmp);
                setChattingList(next);
                setChattingListStartId(res.data.startId);
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    alert("채팅을 불러오지 못했습니다.");
                }
            });
        }
    }, [inView]);

    return(
        <div className={Style.wholeCover}>
            <form className={Style.chattingRoomNameArea}>
                <input 
                    className={Style.chattingRoomName}
                    value={chattingRoomName}
                    disabled={true}
                />
            </form>
            <div id="chatbox" className={Style.chattingListArea}>
                <div className={Style.chattingListAreaSize}>
                    {
                        chattingList.map((data, index) => (
                            index === 0 ?
                            <SingleChat data={data} key={index} setLeftBookState={setLeftBookState} userId={userId} oldestChat={oldestChat}/>
                            :
                            <SingleChat data={data} key={index} setLeftBookState={setLeftBookState} userId={userId} oldestChat={null}/>
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