import Style from './chat.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getChattingListUrl,
    getChattingRoomStuffUrl,
} from '../../../../apiUrl';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
import { Temporal } from '@js-temporal/polyfill';
import { data } from 'jquery';

const SingleChat = ({data, setLeftBookState, userId, userAndUserImg, userAndUserNickname, oldestChat}) => {
    //유저의 이미지나 이름을 클릭하면 해당 유저의 페이지로 이동한다. <---------------이동이 있는 곳!
    const goToThatUserPage = (event) => {
        event.preventDefault();
        setLeftBookState(`pList/${data.userDto.userId}`);
    };

    //시간 계산 함수
    /** claTime: 업로드된 시간. output: 안에 들어갈 문자열  */
    const calculateTimeFrom = (calTime) => {
        const now = Temporal.Now.plainDateTimeISO();
        let postedTime = Temporal.PlainDateTime.from(calTime);
        postedTime = postedTime.add({hours: 9});//9시간을 추가한다.
        if(postedTime.year === now.year &&postedTime.month === now.month && postedTime.day === now.day){//연,월,일이 오늘이면, 시간과 분을 쓰고,
            return `${postedTime.hour.toString().padStart(2, "0")}:${postedTime.minute.toString().padStart(2, "0")}`;
        }
        else{//연월일이 오늘이 아니면 월 일을 쓴다.
            return `${postedTime.month}월 ${postedTime.date}일`;
        }
    };

    return(
        <div className={userId !== data.userId ? Style.singleOtherChattingArea : Style.singleMyChattingArea} ref={oldestChat}>            
            {/* 유저의 프로필 이미지가 오는 곳 */
                userId !== data.userId ?
               <img src={userAndUserImg[data.userId]} className={Style.chatUserimg} onClick={goToThatUserPage}/> : null
            }
            <div className={Style.userchatFlexBox}>
                {/* 유저의 이름이 오는 곳 */
                    userId !== data.userId ?
                    <p className={Style.chatuserName} onClick={goToThatUserPage}>{userAndUserNickname[data.userId]}</p> : null
                }
                {/* 유저의 채팅 내용이 오는 곳 */}
                <div className={Style.chattingText} style={userId !== data.userId ? null : {backgroundColor: "#F4DEDE"}}>{data.message}</div>
                <p className={Style.chatTime}>{calculateTimeFrom(data.createdDate)}</p>
            </div>
        </div>
    );
};

const LeftChat = ({refreshAccessToken, leftBookState, setLeftBookState, userId, stompClient, setStompClient}) => {
    const [chattingRoomId, setChattingRoomId] = useState(-1);//채팅방의 id
    const [chattingRoomName, setChattingRoomName] = useState("");//채팅방 이름
    const [chattingList, setChattingList] = useState([]);//채팅방의 채팅들
    const [chattingListStartId, setChattingListStartId] = useState(987654321);//채팅방의 채팅을 불러오는 startId
    const [oldestChat, inView] = useInView();//가장 오래된(가장 위의) 채팅에게 값을 넣으면 inView값 변경
    const [userChatInput, setUserChatInput] = useState("");//사용자의 채팅 내용
    const [noMoreChat, setNoMoreChat] = useState(false);//더이상 불러올 과거의 채팅이 없는 경우 true로 정한다.

    const [userAndUserImg, setUserAndUserImg] = useState({});//해당 채팅방의 유저 id와 그 유저의 프로필의 value를 넣어둔다. key=id, value=imgUrl
    const [userAndUserNickname, setUserAndUserNickname] = useState({});//해당 채팅방의 유저 id와 그 유저의 닉네임의 value를 넣어둔다. key=id, value=닉네임

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
        if(stompClient !== null){//이전에 할당받은 친구가 있었던 경우 disconnect하고 지금 생성한 Stomp를 넣어준다.
            stompClient.disconnect(function(){
                stompClient.unsubscribe();
            })
        }
        setStompClient(tmp);
    };

    //소켓이 추가되면 그에 맞는 함수를 추가하는 함수
    useEffect(() => {
        if(stompClient === null) return; //초기 상황에는 그냥 종료
        stompClient.connect({}, function (frame) {
            stompClient.subscribe(`/sub/${chattingRoomId}`, function (chatMessage) {//구독
                let tmpchat = chatMessage.body;
                tmpchat = JSON.parse(tmpchat);
                const tmp = [...chattingList];
                tmp.push(tmpchat);
                setChattingList(tmp);
            });
        });
    }, [stompClient]);


    //가장 먼저 채팅방의 아이디를 가져온다.
    const presetChattingRoomId = () => {
        setChattingRoomId(leftBookState.split('/')[1]);
        setChattingListStartId(987654321);//초기화 필요
        setUserAndUserImg({});//초기화 필요
        setUserAndUserNickname({});//초기화 필요
    }
    useEffect(presetChattingRoomId, [leftBookState]);//초기 실행 - leftBookState가 바뀌면 실행한다.

    //채팅이 추가되면 자동으로 스크롤 해주는 함수
    useEffect(() => {
        document.querySelector("#chatbox").scrollTop = document.querySelector("#chatbox").scrollHeight;
    }, [chattingList]);

    //id가 주어졌을 때 이제 해당 채팅방의 채팅들을 불러오고 소캣을 연결한다.
    const preSetChattingRoomInfo = () => {
        if(chattingRoomId === -1) return;//초기상황에서는 그냥 종료
        
        axios.get(`${getChattingRoomStuffUrl}/${chattingRoomId}`)
        .then((res) => {
            setChattingRoomName(res.data.data.name);
            const tmpNickname = {};
            const tmpUserImg = {};
            res.data.data.userDto.map((data) => {
                tmpNickname[data.userId] = data.nickname;
                tmpUserImg[data.userId] = data.imgUrl;
            });
            setUserAndUserNickname(tmpNickname);//유저id와 이름 페어 지정
            setUserAndUserImg(tmpUserImg);//유저id와 프로필 이미지 페어 지정
            socketConnect();//소캣도 연결한다.
            //여기서 채팅방 유저의 id들과 프로필 이미지 정보를 받는다.
            //만약 내 정보가 있다면 그건 내 정보를 저장하는 변수에 set하면 된다.
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                alert("채팅방의 이름을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(preSetChattingRoomInfo, [chattingRoomId]);

    const gettingChattingList = () => {
        if(chattingRoomId === -1) return;//초기상황에서는 그냥 종료

        axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
        .then((res) => {
            const cur = [...chattingList];//지금의 채팅방 채팅 리스트
            const tmp = [...res.data.data];//받아온 채팅방 채팅 리스트
            if(tmp.length === 0){
                setNoMoreChat(true);
            }
            const revTmp = tmp.reverse();
            const next = revTmp.concat(cur);
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
    };
    useEffect(gettingChattingList, [chattingRoomName]);//채팅방 아이디를 가져오면 진행

    //채팅 제출함수<-----------------------------여기 바꿔야함
    const userChattingSubmitHandler = (event) => {
        if(event !== null) {//이벤트가 submit일 수도 있고 그냥 엔터눌러서 온 걸 수도 있다. 엔터면 그냥 넘어가고 submit이면 preventDefault()한다.
            event.preventDefault();
        }
        if(userChatInput === "") return;//입력한게 없으면 제출 X
        
        const now = new Date();
        stompClient.send(`/pub/${chattingRoomId}`, {},
            JSON.stringify({
                userId: userId,
                message: userChatInput,
                createdDate : now,
            })
        );
        setUserChatInput("");
    };

    //무한 로딩 함수 - 작동 확인함
    useEffect(() => {
        if(inView && !noMoreChat){
            gettingChattingList();
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
                            <SingleChat data={data} key={index} setLeftBookState={setLeftBookState} userId={userId} userAndUserImg={userAndUserImg} userAndUserNickname={userAndUserNickname} oldestChat={oldestChat}/>
                            :
                            <SingleChat data={data} key={index} setLeftBookState={setLeftBookState} userId={userId} userAndUserImg={userAndUserImg} userAndUserNickname={userAndUserNickname} oldestChat={null}/>
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