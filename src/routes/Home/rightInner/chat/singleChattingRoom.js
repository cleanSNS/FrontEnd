import Style from './chat.module.css';
import deletechattingRoom from './close_big.png';
import {
    deleteChattingRoomUrl,
} from '../../../../apiUrl';
import {
    deleteAxios
} from '../../../../apiCall';

const SingleChattingRoom = ({data, setLeftBookState, refreshAccessToken, gettingChattingRoomList, leftBookState, searched, setSearched, chatLoading, setChatLoading}) => {
    const chatClickHandler = async (event) => {
        if(chatLoading) return;//다른 채팅방이 아직 로딩중이면 작동을 하지 않음

        if(event.target.id === "chattingRoomDeleteBtn"){//닫기를 누른 경우
            if(window.confirm("정말 채팅방을 나가실 건가요?")){
                await deleteAxios(`${deleteChattingRoomUrl}/${data.chatroomId}`, refreshAccessToken);
                alert("채팅방에서 나갔습니다.");
                if(leftBookState === `chat/${data.chatroomId}`){//나간 방에 들어와 있는 상태라면 나가야한다.
                    setLeftBookState("page");//다른 화면으로 강제 전환시킨다.
                }
                gettingChattingRoomList();//채팅방 다시 로드
            }
        }
        else{//닫기가 아닌 그냥 채팅방을 클릭한 경우
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

export default SingleChattingRoom;