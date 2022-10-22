import Style from './chat.module.css';
import chatAddBtn from './message_plus_alt.png';
import deletechattingRoom from './close_big.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    getChattingRoomListUrl,
    deleteChattingRoomUrl,
} from '../../../../apiUrl';

const SingleChattingRoom = ({data, setLeftBookState, refreshAccessToken, presetChattingRoomList, leftBookState}) => {
    //click Handler
    const chatClickHandler = () => {
        setLeftBookState(`chat/${data.chatroomId}`);
    };

    //채팅방 닫기 클릭 handler
    const chattingRoomDeleteClickHandler = () => {
        if(window.confirm("정말 채팅방을 나가실 건가요?")){
            axios.delete(`${deleteChattingRoomUrl}/${data.chatroomId}`)
            .then((res) => {
                alert("채팅방에서 나갔습니다.");
                if(leftBookState === `chat/${data.chatroomId}`){//나간 방에 들어와 있는 상태라면 나가야한다.
                    setLeftBookState("page");//다른 화면으로 강제 전환시킨다.
                }
                presetChattingRoomList();//채팅방 다시 로드
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    alert("채팅방에서 나가지 못했습니다.");
                }
            });
        }
    };

    return(
        <div className={Style.singleChat}>
            {/* 이미지 영역 유저(data.headCount)가 1,2,3,4(혹은 그 이상) 일 때를 각각 만드는게 좋을듯 */}
            {
                data.headCount === 1 ?
                <div className={Style.singleImgFlex}>
                    <img src={data.userImgUrlList[0]} className={Style.chatImgBig} onClick={chatClickHandler} />
                </div> : 
                data.headCount === 2 ?
                <div className={Style.flexBox}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <div />
                        <div />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                    </div>
                </div> : 
                data.headCount === 3 ?
                <div className={Style.flexBox}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[2]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <div />
                    </div>
                </div> : 
                <div className={Style.flexBox}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[2]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[3]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                    </div>
                </div>
            }
            <div className={Style.flexBoxcol}>
                <div className={Style.flexBoxRight}>
                    <img src={deletechattingRoom} onClick={chattingRoomDeleteClickHandler} style={{cursor: "pointer"}}/>
                </div>
                <p className={Style.chatName} onClick={chatClickHandler}>{data.name}</p>
                <p className={Style.lastChat} onClick={chatClickHandler}>{data.lastChat}</p>
            </div>
        </div>
    );
};

const RightChat = ({refreshAccessToken, setLeftBookState, leftBookState, rightBookState, chattingTriger, setChattingTriger}) => {
    const [chatSearchInput, setChatSearchInput] = useState("");//검색창에 입력된 정보
    const [chattingRoomList, setChattingRoomList] = useState([]);//채팅방들의 정보를 가진 리스트

    //채팅방 검색 input change Handler
    const chatSearchInputChangeHandler = (event) => {
        setChatSearchInput(event.target.value);
    };

    /*****************채팅창 불러오기******************/
    const presetChattingRoomList = () => {
        if(rightBookState === "chat"){//오른쪽이 chat일 때만 실행
            console.log("preset ChattingRoom");
            axios.get(getChattingRoomListUrl)
            .then((res) => {
                const tmp = [...res.data.data];
                setChattingRoomList(tmp);
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    alert("채팅방을 불러오지 못했습니다.");
                }
            })
        }
    };
    useEffect(presetChattingRoomList, [rightBookState]);


    useEffect(() => {
        console.log(chattingTriger);
        console.log("트리거 발생하는 곳");
        if(chattingTriger){//트리거가 발생한 순간에만 로딩
            axios.get(getChattingRoomListUrl)
            .then((res) => {
                const tmp = [...res.data.data];
                setChattingRoomList(tmp);
                setChattingTriger(false);
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    alert("채팅방을 불러오지 못했습니다.");
                }
            });
        }
    }, [chattingTriger]);

    //새 채팅방 click Handler
    const newChatClickHandler = () => {
        setLeftBookState("makeNewC");
    };

    return(
        <div className={Style.wholeCover}>
            <div className={Style.chatList}>
                <div className={Style.searchBarArea}>
                    <form className={Style.flexBox}>
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
                        <SingleChattingRoom key={index} data={data} setLeftBookState={setLeftBookState} refreshAccessToken={refreshAccessToken} presetChattingRoomList={presetChattingRoomList} leftBookState={leftBookState} />
                    ))
                }
            </div>
        </div>
    );
}

export default RightChat;