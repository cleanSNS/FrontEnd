import Style from './chat.module.css';
import chatAddBtn from './message_plus_alt.png';
import SingleChattingRoom from "./singleChattingRoom";
import { useState, useEffect } from 'react';
import {
    getChattingRoomListUrl,
} from '../../../../apiUrl';
import {
    getAxios
} from '../../../../apiCall';

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

    const gettingChattingRoomList = async () => {
        const res = await getAxios(getChattingRoomListUrl, refreshAccessToken);
        const tmp = [...res.data.data];
        setChattingRoomList(tmp);
        setChattingTriger(false);
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