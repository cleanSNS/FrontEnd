import Style from './chat.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getChattingListUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const SingleChat = ({data}) => {
    return(
        <div className={"조건식-id가 내꺼가 아니면" ? Style.singleOtherChattingArea : Style.singleMyChattingArea}>
            
            {/* 유저의 프로필 이미지가 오는 곳 */
                "조건식 - id가 내꺼가 아니면" ?
                <div className={Style.userImgFlexBox}>
                    <img className={Style.chatUserimg} />
                </div> : null
            }
            <div className={Style.userchatFlexBox}>
                {/* 유저의 이름이 오는 곳 */
                    "조건식 - id가 내꺼가 아니면" ?
                    <p className={Style.chatuserName}>이름</p> : null
                }
                {/* 유저의 채팅 내용이 오는 곳 */}
                <div className={Style.chattingText}>
                    안녕하세요. 글이 겁나게 길어졌을 때 자동으로 줄 바꿈 되고 줄 바꿈 하면서 height도 그에 맞게 길어지는지 확인 일단 자동으로 줄 바꿈은 되는데 과연 높이도 달라질것인가 달라지는데 이게 이상하게 중앙에 맞춰지는구나 이게 지금 되고있는건가 아닌건가 아아아아아아아아아아아아 되나 이것도? 오 되는거 같다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                </div>
            </div>
        </div>
    );
};

const LeftChat = ({refreshAccessToken, leftBookState}) => {
    const [chattingRoomId, setChattingRoomId] = useState(-1);//채팅방의 id
    const [chattingRoomName, setChattingRoomName] = useState("채팅방의 이름이 오는 자리입니다.");//채팅방 이름
    const [chattingList, setChattingList] = useState([]);//채팅방의 채팅들
    const [chattingListStartId, setChattingListStartId] = useState(987654321);//채팅방의 채팅을 불러오는 startId
    const [oldestChat, inView] = useInView();//가장 오래된(가장 위의) 채팅에게 값을 넣으면 inView값 변경

    //가장 먼저 채팅방의 아이디를 가져온다.
    const presetChattingRoomId = () => {
        setChattingRoomId(leftBookState.split('/')[1]);
    }
    useEffect(presetChattingRoomId, []);//초기 실행

    //id가 주어졌을 때 이제 해당 채팅방의 채팅들을 불러온다.<------------바뀔 수 있음(이름 불러오는 api도 추가해야 함)
    const presetChattingList = () => {
        axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
        .then((res) => {
            const cur = [...chattingList];//지금의 채팅방 채팅 리스트
            const tmp = [...res.data.data];//받아온 채팅방 채팅 리스트
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
    };
    useEffect(presetChattingList, [chattingRoomId]);//채팅방 아이디를 가져오면 진행

    return(
        <div className={Style.wholeCover}>
            <form className={Style.chattingRoomNameArea}>
                <input 
                    className={Style.chattingRoomName}
                    value={chattingRoomName}
                    disabled="true"
                />
            </form>
            <div className={Style.chattingListArea}>
                <div className={Style.chattingListAreaSize}>
                    <SingleChat data={""} />
                    {
                        chattingList.map((data, index) => (
                            <SingleChat data={data} key={index}/>
                        ))
                    }
                </div>
            </div>
            <form className={Style.userChatArea}>
                <textarea className={Style.userChatInput}/>
                <div className={Style.userChatBtnArea}>
                    <button className={Style.userChatBtn}>제출</button>
                </div>
            </form>
        </div>
    );
}

export default LeftChat;