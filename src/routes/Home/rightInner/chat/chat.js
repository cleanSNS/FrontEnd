import Style from './chat.module.css';
import chatAddBtn from './message_plus_alt.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    getChattingRoomListUrl,
} from '../../../../apiUrl';

const SingleChattingRoom = ({data, setLeftBookState}) => {
    //임시 테스트용 click Handler
    const chatClickHandler = () => {
        setLeftBookState(`chat/${data.chatroomId}`);
    };

    return(
        <div className={Style.singleChat}>
            {/* 이미지 영역 유저(data.headCount)가 1,2,3,4(혹은 그 이상) 일 때를 각각 만드는게 좋을듯 */}
            {
                data.headCount === 1 ?
                <div className={Style.singleImgFlex} style={{width: "20%"}}>
                    <img src={data.userImgUrlList[0]} className={Style.chatImgBig} onClick={chatClickHandler} />
                </div> : 
                data.headCount === 2 ?
                <div className={Style.flexBox} style={{width: "20%"}}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <div />
                        <div />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                    </div>
                </div> : 
                data.headCount === 3 ?
                <div className={Style.flexBox} style={{width: "20%"}}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[2]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <div />
                    </div>
                </div> : 
                <div className={Style.flexBox} style={{width: "20%"}}>
                    <div className={Style.overDoubleImgFlex}>
                        <img src={data.userImgUrlList[0]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[1]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[2]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                        <img src={data.userImgUrlList[3]} className={Style.chatImgSmall} onClick={chatClickHandler} />
                    </div>
                </div>
            }
            <div className={Style.flexBoxcol} style={{width: "80%"}}>
                <p className={Style.chatName} onClick={chatClickHandler}>{data.name}</p>
                <p className={Style.lastChat} onClick={chatClickHandler}>{data.lastChat}</p>
            </div>
        </div>
    );
};

const RightChat = ({refreshAccessToken, setLeftBookState, leftBookState}) => {
    const [chatSearchInput, setChatSearchInput] = useState("");//검색창에 입력된 정보
    const [chattingRoomList, setChattingRoomList] = useState([]);//채팅방들의 정보를 가진 리스트

    //채팅방 검색 input change Handler
    const chatSearchInputChangeHandler = (event) => {
        setChatSearchInput(event.target.value);
    };

    /*****************채팅창 불러오기******************/
    const presetChattingRoomList = () => {
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
    };
    useEffect(presetChattingRoomList, [leftBookState]);

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
                        <SingleChattingRoom key={index} data={data} setLeftBookState={setLeftBookState}/>
                    ))
                }
            </div>
        </div>
    );
}

export default RightChat;