import Style from './chat.module.css';
import editImg from './edit.png';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getChattingListUrl,
    getChattingRoomStuffUrl,
    changeChattingRoomNameUrl,
} from '../../../../apiUrl';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
import { Temporal } from '@js-temporal/polyfill';

const SingleChat = ({data, setLeftBookState, userId, userAndUserImg, userAndUserNickname, oldestChat}) => {
    //유저의 이미지나 이름을 클릭하면 해당 유저의 페이지로 이동한다.
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

const LeftChat = ({chattingRoomId, setChattingRoomId, refreshAccessToken, leftBookState, setLeftBookState, userId, stompClient, setStompClient, setChatLoading}) => {
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

    const onChattingRoomNameChangeHandler = (event) => {
        setChattingRoomName(event.target.value)
    }

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

    //새로 채팅이 불리면 내용을 저장
    const [newChatting, setNewChatting] = useState("");
    useEffect(() => {
        if(stompClient === null) return; //초기 상황에는 그냥 종료
        stompClient.connect({}, function (frame) {
            stompClient.subscribe(`/sub/${chattingRoomId}`, function (chatMessage) {//구독
                let tmpchat = chatMessage.body;
                tmpchat = JSON.parse(tmpchat);
                setNewChatting(tmpchat);
            });
        });
    }, [stompClient]);

    //새로 불린 내용이 있으면 chattingList에 넣기
    useEffect(() => {
        if(newChatting === "") return;

        const tmp = [...chattingList];
        tmp.push(newChatting);
        setChattingList(tmp);
        setNeedScroll(true);

    }, [newChatting]);


    //가장 먼저 채팅방의 아이디를 가져온다.
    const presetChattingRoomId = () => {
        if(stompClient !== null){//이전에 할당받은 친구가 있었던 경우(당연히 채팅방 id도 있다.) disconnect하고 지금 생성한 Stomp를 넣어준다.
            stompClient.unsubscribe(`/sub/${chattingRoomId}`);
            stompClient.disconnect();
        }
        setChattingRoomId(leftBookState.split('/')[1]);
        setChattingListStartId(987654321);//초기화 필요
        setUserAndUserImg({});//초기화 필요
        setUserAndUserNickname({});//초기화 필요
        setChattingList([]);//초기화 필요
        SetchattingRoomInfoSet(false);//초기화 필요
        setNoMoreChat(false);
        document.querySelector("#userChatInput").focus();
    }
    useEffect(presetChattingRoomId, [leftBookState]);//초기 실행 - leftBookState가 바뀌면 실행한다.

    //채팅이 추가되면 자동으로 스크롤 해주는 함수
    const [needScroll, setNeedScroll] = useState(false);
    const [currentScrollHeight, setCurrentScrollHeight] = useState(0);
    useEffect(() => {
        if(needScroll){//채팅이 하나 추가된 것이나, 첫 상황으로 아래로 그냥 내려가면 된다. 이 때의 높이를 기록한다.
            document.querySelector("#chatbox").scrollTop = document.querySelector("#chatbox").scrollHeight;
            setNeedScroll(false);
        }
        else{//상단에 추가된 경우
            document.querySelector("#chatbox").scrollTop = (document.querySelector("#chatbox").scrollHeight - currentScrollHeight);
        }
        setCurrentScrollHeight(document.querySelector("#chatbox").scrollHeight);
    }, [chattingList]);

    //id가 주어졌을 때 이제 해당 채팅방의 채팅들을 불러오고 소캣을 연결한다.
    const [chattingroomInfoSet, SetchattingRoomInfoSet] = useState(false);//다음 함수 트리거용
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
            SetchattingRoomInfoSet(true);
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
        if(!chattingroomInfoSet) return;//아직 정보를 불러오지 않은 상태이므로 종료

        axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
        .then((res) => {
            const cur = [...chattingList];//지금의 채팅방 채팅 리스트
            const tmp = [...res.data.data];//받아온 채팅방 채팅 리스트
            if(tmp.length === 0){
                setNoMoreChat(true);
            }
            else{
                const revTmp = tmp.reverse();
                const next = revTmp.concat(cur);
                setChattingList(next);
            }
            if(chattingListStartId === 987654321){
                setNeedScroll(true);
            }
            setChattingListStartId(res.data.startId);
            setChatLoading(false);//이제 다른 방으로 이동 가능하게 한다.
        })
        .catch((res) => {
            setChatLoading(false);//이제 다른 방으로 이동 가능하게 한다.
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                alert("채팅을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(gettingChattingList, [chattingroomInfoSet]);//채팅방 이름이 업데이트 되면 진행

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

    //채팅방 이름 변경
    const chattingRoomNamechangeSubmitHandler = (event) => {
        event.preventDefault();
        document.querySelector("#chattingRoomName").disabled = true;
        axios.post(`${changeChattingRoomNameUrl}/${chattingRoomId}`,{
            name: chattingRoomName,
        })
        .then((res) =>{
            console.log(res);
            console.log("채팅방 이름을 바꿨습니다.");
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                alert("채팅방 이름을 바꾸지 못했습니다.");
            }
        });
    };

    //채팅방 이름 더블클릭 시 변경 가능하게 바꾸기
    const onChatnameClickHandler = (event) => {
        event.preventDefault();
        console.log("클릭함");
        document.querySelector("#chattingRoomName").disabled = false;
        document.querySelector("#chattingRoomName").select();
    }

    return(
        <div className={Style.wholeCover}>
            <form className={Style.chattingRoomNameArea} onSubmit={chattingRoomNamechangeSubmitHandler}>
                <div className={Style.flexBoxRight}>
                    <img src={editImg} onClick={onChatnameClickHandler} style={{cursor: "pointer"}} />
                </div>
                <input
                    id="chattingRoomName"
                    className={Style.chattingRoomName}
                    value={chattingRoomName}
                    onChange={onChattingRoomNameChangeHandler}
                    maxLength={10}
                    disabled={true}
                    style={{cursor: "pointer"}}
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
                    id="userChatInput"
                />
                <div className={Style.userChatBtnArea}>
                    <button className={Style.userChatBtn}>제출</button>
                </div>
            </form>
        </div>
    );
}

export default LeftChat;