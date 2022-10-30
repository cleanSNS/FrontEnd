import Style from './chat.module.css';
import chatAddBtn from './message_plus_alt.png';
import deletechattingRoom from './close_big.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    getChattingRoomListUrl,
    deleteChattingRoomUrl,
} from '../../../../apiUrl';

const SingleChattingRoom = ({data, setLeftBookState, refreshAccessToken, gettingChattingRoomList, leftBookState, searched, setSearched, chatLoading, setChatLoading}) => {
    //click Handler
    const chatClickHandler = (event) => {
        if(chatLoading) return;//다른 채팅방이 아직 로딩중이면 작동을 하지 않음

        if(event.target.id === "chattingRoomDeleteBtn"){//닫기를 누른 경우
            if(window.confirm("정말 채팅방을 나가실 건가요?")){
                axios.delete(`${deleteChattingRoomUrl}/${data.chatroomId}`)
                .then((res) => {
                    alert("채팅방에서 나갔습니다.");
                    if(leftBookState === `chat/${data.chatroomId}`){//나간 방에 들어와 있는 상태라면 나가야한다.
                        setLeftBookState("page");//다른 화면으로 강제 전환시킨다.
                    }
                    gettingChattingRoomList();//채팅방 다시 로드
                })
                .catch((res) => {
                    if(res.response.status === 401 || res.response.status === 0){
                        refreshAccessToken();
                    }
                    else{
                        alert("채팅방에서 나가지 못했습니다.");
                    }
                });
            }
        }
        else{
            if(data.chatroomId === Number(leftBookState.split('/')[1])) return;//이미 그 방에 들어와 있다면 작동을 하지 않음
            setLeftBookState(`chat/${data.chatroomId}`);
            setChatLoading(true);//이동과 동시에 이제 로딩할 것이기 때문에 true로 값 변경
            if(searched){
                console.log("채팅방으로 입장하여 검색 결과를 초기화합니다.");
                gettingChattingRoomList();//검색된 상태면 다시 채팅방 리스트를 불러온다.
                setSearched(false);
            }
        }
    };

    return(
        <div className={Style.singleChat} onClick={chatClickHandler}>
            {/* 이미지 영역 유저(data.headCount)가 1,2,3,4(혹은 그 이상) 일 때를 각각 만드는게 좋을듯 */}
            {
                data.headCount === 1 ?
                <div className={Style.singleImgFlex}>
                    <img src={data.userImgUrlList[0]} className={Style.chatImgBig} />
                </div> : 
                data.headCount === 2 ?
                <div className={Style.flexBox}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} />
                        <div />
                        <div />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} />
                    </div>
                </div> : 
                data.headCount === 3 ?
                <div className={Style.flexBox}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} />
                        <img src={data.userImgUrlList[2]} className={Style.chatImgSmall} />
                        <div />
                    </div>
                </div> : 
                <div className={Style.flexBox}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} />
                        <img src={data.userImgUrlList[2]} className={Style.chatImgSmall} />
                        <img src={data.userImgUrlList[3]} className={Style.chatImgSmall} />
                    </div>
                </div>
            }
            <div className={Style.flexBoxcol}>
                <div className={Style.flexBoxRight} style={{height: "30%"}}>
                    <img src={deletechattingRoom} id="chattingRoomDeleteBtn" style={{cursor: "pointer"}}/>
                </div>
                <p className={Style.chatName}>{data.name}</p>
                <p className={Style.lastChat}>{data.lastChat}</p>
                <div className={Style.flexBoxRight} style={{height: "20%"}}>
                    {
                        data.uncheckedChatCount === 0 ? null :
                        <p className={Style.chatNumber}>{data.uncheckedChatCount}</p>
                    }
                </div>
            </div>
        </div>
    );
};

const RightChat = ({refreshAccessToken, setLeftBookState, leftBookState, rightBookState, chattingTriger, setChattingTriger, chatLoading, setChatLoading, chatAndFriendReloadTriger, setChatAndFriendReloadTriger}) => {
    const [chatSearchInput, setChatSearchInput] = useState("");//검색창에 입력된 정보
    const [chattingRoomList, setChattingRoomList] = useState([]);//채팅방들의 정보를 가진 리스트
    const [searched, setSearched] = useState(false);//채팅방이 검색된 상태인지 알려주는 변수

    //채팅방 검색 input change Handler
    const chatSearchInputChangeHandler = (event) => {
        setChatSearchInput(event.target.value);
        if(searched){
            console.log("검색어가 변경 되어 검색 결과를 초기화 합니다.");
            gettingChattingRoomList();//검색된 상태면 다시 채팅방 리스트를 불러온다.
            setSearched(false);
        }
    };

    const gettingChattingRoomList = () => {
        axios.get(getChattingRoomListUrl)
        .then((res) => {
            const tmp = [...res.data.data];
            setChattingRoomList(tmp);
            setChattingTriger(false);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){
                refreshAccessToken();
            }
            else{
                alert("채팅방을 불러오지 못했습니다.");
            }
        });
    };

    /*****************채팅창 불러오기******************/
    useEffect(() => {
        if(rightBookState === "chat"){//오른쪽이 chat일 때만 실행
            gettingChattingRoomList();
        }
    }, [rightBookState]);//초기 설정


    useEffect(() => {//이 트리거는 새로운 채팅이 올라왔을 때 발생
        if(chattingTriger){//트리거가 발생한 순간에만 로딩
            gettingChattingRoomList();
        }
    }, [chattingTriger]);

    useEffect(() => {//이 트리거는 사용자가 오른쪽 페이지가 채팅일 때, 프로필 변경을 하면 발행
        if(chatAndFriendReloadTriger){//트리거가 발생한 순간에만 로딩
            gettingChattingRoomList();
            setChatAndFriendReloadTriger(false);
        }
    }, [chatAndFriendReloadTriger]);

    //새 채팅방 click Handler
    const newChatClickHandler = () => {
        setLeftBookState("makeNewC");
    };

    //채팅방 찾는 handler
    const findChattingRoomHandler = (event) => {
        event.preventDefault();
        if(chatSearchInput === "") return; //검색어가 비어있으면 아무 일도 일어나지 않는다.

        console.log(chattingRoomList);
        console.log("위 리스트에서 아래 검색어를 검색합니다.");
        console.log(chatSearchInput);

        //채팅방 검색 기준은 채팅방의 이름이다.
        const searchedList = chattingRoomList.filter(d => d.name.includes(chatSearchInput));
        console.log(searchedList);
        setChattingRoomList(searchedList);
        setSearched(true);
    };

    return(
        <div className={Style.wholeCover}>
            <div className={Style.chatList}>
                <div className={Style.searchBarArea}>
                    <form className={Style.flexBox} onSubmit={findChattingRoomHandler}>
                        <input 
                            className={Style.searchBar}
                            placeholder="채팅방을 검색하세요."
                            value={chatSearchInput}
                            onChange={chatSearchInputChangeHandler}
                        />
                    </form>
                    <div className={Style.flexBox}>
                        <img src={chatAddBtn} className={Style.makeNewChat} onClick={newChatClickHandler}/>
                    </div>
                </div>
                {
                    chattingRoomList.map((data, index) => (
                        <SingleChattingRoom key={index} data={data} setLeftBookState={setLeftBookState} refreshAccessToken={refreshAccessToken} gettingChattingRoomList={gettingChattingRoomList} leftBookState={leftBookState} searched={searched} setSearched={setSearched} chatLoading={chatLoading} setChatLoading={setChatLoading} />
                    ))
                }
            </div>
        </div>
    );
}

export default RightChat;