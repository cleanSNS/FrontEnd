import Style from './chat.module.css';
import chatAddBtn from './message_plus_alt.png';
import axios from 'axios';
import { useState, useEffect } from 'react';

const RightChat = ({refreshAccessToken, setLeftBookState}) => {
    const [chatSearchInput, setChatSearchInput] = useState("");//검색창에 입력된 정보

    //채팅방 검색 input change Handler
    const chatSearchInputChangeHandler = (event) => {
        setChatSearchInput(event.target.value);
    };

    //임시 테스트용 click Handler<------------------------------변동 가능성 높음
    const chatClickHandler = () => {
        setLeftBookState("chat");
    };

    //새 채팅방 click Handler
    const newChatClickHandler = () => {
        setLeftBookState("newChat");
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
                {/* 여기 내부를 이제 뭐시기.map으로 넣으면 되는데 일단 CSS먼저 확인하기 */}
                    <div className={Style.singleChat}>
                        <div className={Style.flexBox}>
                            <img className={Style.chatImg} onClick={chatClickHandler} />
                        </div>
                        <div className={Style.flexBox}>
                            <p className={Style.chatName} onClick={chatClickHandler}>Chat Name</p>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default RightChat;