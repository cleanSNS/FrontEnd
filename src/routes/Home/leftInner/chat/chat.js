import Style from './chat.module.css';
import editImg from './edit.png';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getChattingListUrl,
    getChattingRoomStuffUrl,
    changeChattingRoomNameUrl,
} from '../../../../apiUrl';
import { getAxios, postAxios } from "../../../../apiCall";
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';

import SingleChat from './singleChat';

const LeftChat = ({chattingRoomId, setChattingRoomId, refreshAccessToken, leftBookState, setLeftBookState, userId, stompClient, setStompClient, setChatLoading, setChattingTriger}) => {
    const [chattingRoomName, setChattingRoomName] = useState("");//채팅방 이름
    const [chattingList, setChattingList] = useState([]);//채팅방의 채팅들
    const [chattingListStartId, setChattingListStartId] = useState(987654321);//채팅방의 채팅을 불러오는 startId
    const [oldestChat, inView] = useInView();//가장 오래된(가장 위의) 채팅에게 값을 넣으면 inView값 변경
    const [userChatInput, setUserChatInput] = useState("");//사용자의 채팅 내용
    const [noMoreChat, setNoMoreChat] = useState(false);//더이상 불러올 과거의 채팅이 없는 경우 true로 정한다.

    const [userAndUserImg, setUserAndUserImg] = useState({});//해당 채팅방의 유저 id와 그 유저의 프로필의 value를 넣어둔다. key=id, value=imgUrl
    const [userAndUserNickname, setUserAndUserNickname] = useState({});//해당 채팅방의 유저 id와 그 유저의 닉네임의 value를 넣어둔다. key=id, value=닉네임

    const [loading, setLoading] = useState(true);

    //사용자 채팅 입력 처리
    const onUserChattingChangeHandler = (event) => {
        setUserChatInput(event.target.value);
    };

    //채팅방 이름 변경 처리
    const onChattingRoomNameChangeHandler = (event) => {
        setChattingRoomName(event.target.value)
    }

    //엔터 입력 시 event를 없애고 submitHandler를 실행한다.
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

    //소켓에 의해 채팅이 들어오면 newChatting에 값을 세팅해준다.
    const [newChatting, setNewChatting] = useState("");//새로 로드된 채팅 - 소캣에서 인식된 하나의 채팅이다.
    useEffect(() => {
        if(stompClient === null) return; //초기 상황에는 그냥 종료
        stompClient.connect({}, function (frame) {
            stompClient.subscribe(`/sub/${chattingRoomId}`, function (chatMessage) {//구독
                const tmpchat = JSON.parse(chatMessage.body);
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
        setNewChatting("");
    }, [newChatting]);

    //초기함수 1번 - id를 가져오고 초기화를 하는함수
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
        setNoMoreChat(false);
        setLoading(true);//로딩을 다시 해야함
    }
    useEffect(() => {presetChattingRoomId();}, [leftBookState]);//초기 실행 - leftBookState가 바뀌면 실행한다. - 이건 바꾸면 안됨 채팅 종류만 달라질 수 있음 이 경우 leftBookState가 안달라짐

    //초기함수 2번 - id를 받은 이후 이를 활용하여 채팅방 정보와 채팅 내역을 불러오는 함수
    const preSetChattingRoomInfo = async () => {
        if(chattingRoomId === -1) return;//초기상황에서는 그냥 종료

        const res1 = await getAxios(`${getChattingRoomStuffUrl}/${chattingRoomId}`, {}, refreshAccessToken);
        setChattingRoomName(res1.data.data.name);
        const tmpNickname = {};
        const tmpUserImg = {};
        res1.data.data.userDto.map((data) => {
            tmpNickname[data.userId] = data.nickname;
            tmpUserImg[data.userId] = data.imgUrl;
        });
        setUserAndUserNickname(tmpNickname);//유저id와 이름 페어 지정
        setUserAndUserImg(tmpUserImg);//유저id와 프로필 이미지 페어 지정
        socketConnect();//소캣도 연결한다.

        await gettingChattingList();
        setChatLoading(false);//이제 다른 방으로 이동 가능하게 한다.
        setLoading(false);//채팅방 로딩이 종료되었으므로 화면을 띄운다
    };
    useEffect(() => {preSetChattingRoomInfo()}, [chattingRoomId]);

    //로딩이 끝나면 커서를 아래로 넣어주는 함수
    useEffect(() => {if(!loading) document.querySelector("#userChatInput").focus();}, [loading]);

    //채팅 리스트를 불러오는 함수
    const gettingChattingList = async () => {//초기실행 3번
        const res = await getAxios(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`, {}, refreshAccessToken);
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
    };

    //채팅이 추가되면 자동으로 스크롤 해주는 함수
    const [needScroll, setNeedScroll] = useState(false);
    const [currentScrollHeight, setCurrentScrollHeight] = useState(0);
    useEffect(() => {
        if(loading) return;//로딩중이면 실행 X
        if(needScroll){//채팅이 하나 추가된 것이나, 첫 상황으로 아래로 그냥 내려가면 된다. 이 때의 높이를 기록한다.
            document.querySelector("#chatbox").scrollTop = document.querySelector("#chatbox").scrollHeight;
            setNeedScroll(false);
        }
        else{//상단에 추가된 경우
            document.querySelector("#chatbox").scrollTop = (document.querySelector("#chatbox").scrollHeight - currentScrollHeight);
        }
        setCurrentScrollHeight(document.querySelector("#chatbox").scrollHeight);
    }, [chattingList]);

    //채팅 제출함수
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
    const chattingRoomNamechangeSubmitHandler = async (event) => {
        event.preventDefault();
        document.querySelector("#chattingRoomName").disabled = true;

        const sendBody = {
            name: chattingRoomName,
        }
        await postAxios(`${changeChattingRoomNameUrl}/${chattingRoomId}`, sendBody, {}, refreshAccessToken);
        setChattingTriger(true);
    };

    //채팅방 이름 변경 함수
    const onChatnameClickHandler = (event) => {
        event.preventDefault();
        console.log("클릭함");
        document.querySelector("#chattingRoomName").disabled = false;
        document.querySelector("#chattingRoomName").select();
    }

    return(
        loading ? null :
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