import Style from './newChat.module.css';
import { useState, useEffect } from 'react';
import {
    getFolloweeListUrl,
    getfollowerListUrl,
    makeNewChattingRoomUrl,
} from '../../../../apiUrl';
import { getAxios, postAxios } from "../../../../apiCall";

import SingleFriend from './singleFriend';

const LeftNewChat = ({refreshAccessToken, setLeftBookState, userId, setChattingTriger, setChatLoading}) => {
    const [friendSearchInput, setFriendSearchInput] = useState("");//친구 검색용
    const [chattingRoomNameInput, setChattingRoomNameInput] = useState("");//채팅방 이름 입력
    const [outputFriendList, setOutputFriendList] = useState([]);//실제로 출력할 친구 리스트
    const [wholeFriendList, setWholeFriendList] = useState([]);//받아온 친구 리스트
    const [chosenFriendList, setChosenFriendList] = useState([]);//선택된 친구 리스트
    const [followerList, setFollowerList] = useState([]);//친구를 받기 위해 followerList를 받아온다.
    const [followeeList, setFolloweeList] = useState([]);//친구를 받기 위해 followeeList를 받아온다.

    const [loading, setLoading] = useState(true);

    const friendSearchInputChangeHandler = (event) => {
        setFriendSearchInput(event.target.value);
    };

    const chattingRoomNameInputChangeHandler = (event) => {
        setChattingRoomNameInput(event.target.value);
    };

    //팔로워와 팔로잉을 불러오는 함수
    const presetFollowerAndFollowee = async () => {
        const res1 = await getAxios(getFolloweeListUrl, {}, refreshAccessToken);
        const tmp = [...res1.data.data];
        setFolloweeList(tmp);//팔로잉 저장

        const res2 = await getAxios(getfollowerListUrl, {}, refreshAccessToken);
        const tmp2 = [...res2.data.data];
        setFollowerList(tmp2);//팔로워 저장
    };
    useEffect(() => {presetFollowerAndFollowee();}, []);//초기 상황에만 진행

    //팔로워와 팔로잉을 바탕으로 친구 리스트를 파악하는 함수
    const presetFriendList = () => {
        //follower와 follwee에 동시에 속한 값들은 친구로 저장
        const JSONFollowerList = followerList.map(d => JSON.stringify(d));
        const JSONFolloweeList = followeeList.map(d => JSON.stringify(d));
        const JSONFriendList = JSONFollowerList.filter(x => JSONFolloweeList.includes(x));
        setWholeFriendList(JSONFriendList.map(d => JSON.parse(d)));
    };
    useEffect(presetFriendList, [followerList, followeeList]);

    //친구 리스트가 확정되면 일단 그 리스트를 output에 넣는다.
    const presetOutputFriendList = () => {
        const tmp = [...wholeFriendList];
        setOutputFriendList(tmp);
        setLoading(false);
    };
    useEffect(presetOutputFriendList, [wholeFriendList]);

    //유저를 검색하면 outputFriendList가 변경된다. 이를 처리하는 함수
    const changeOutputFriendListbySearch = (event) => {
        event.preventDefault();
        //whole친구 리스트를 바탕으로 조건에 맞는것만 outputList에 반영한다.
        const tmp = wholeFriendList.filter(d => d.nickname.includes(friendSearchInput))//모든 친구중 이름에 검색사항이 포함된 친구만 받는다.
        setOutputFriendList(tmp);//검색된 유저들만 리스트에 올린다.
    };

    //선택된 유저 리스트가 변경되면 output친구 리스트를 변경해야한다.
    const changeOutputFriendListbyClick = () => {
        const JSONWholeFriendList = wholeFriendList.map(d => JSON.stringify(d));
        const JSONChosenFriendList = chosenFriendList.map(d => JSON.stringify(d));
        const leftOverList = JSONWholeFriendList.filter(x => !JSONChosenFriendList.includes(x));//출력값중에서 친구리스트에 없는 친구들이 남은 애들이다.
        setOutputFriendList(leftOverList.map(d => JSON.parse(d)));
        setFriendSearchInput("");//검색을 하고있었을 수 있는데 친구를 클릭하면 검색하던 내용을 없앤다.
    };
    useEffect(changeOutputFriendListbyClick, [chosenFriendList]);

    //채팅방 생성함수
    const [newChatSubmitClicked, setNewChatSubmitClicked] = useState(false);

    const submitAbleAgain = () => {
        setNewChatSubmitClicked(false);
        const btn = document.querySelector('#newChattingBtn');
        btn.innerHTML = '생 성';
        btn.style.color = 'white';
        btn.style.backgroundColor = '#F4DEDE';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
    };

    const createChatClickHandler = (event) => {
        event.preventDefault();
        if(newChatSubmitClicked) return;
        if(chosenFriendList.length === 0){//아무도 선택되지 않은 경우 함수 종료
            alert("1명 이상의 친구를 선택해 주세요.");
            return;
        }
        setNewChatSubmitClicked(true);
        setChatLoading(true);//방 생성중에 다른 채팅방으로 이동 불가
        const btn = document.querySelector('#newChattingBtn');
        btn.innerHTML = "제출중";
        btn.style.color = 'black';
        btn.style.backgroundColor = 'gray';
        btn.style.cursor = 'wait';
        btn.disabled = true;
    };

    const createChatClickHandlerSecondAct = async () => {
        if(!newChatSubmitClicked) return;

        const chosenFriendUserIdList = chosenFriendList.map(d => (d.userId));//id만 뽑아서 배열 생성
        chosenFriendUserIdList.push(userId);//나도 집어넣는다.
        let chattingRoomName = chattingRoomNameInput;//채팅방 이름 설정
        if(chattingRoomName === ""){//사용자가 채팅방 명을 정해주지 않은 경우 이름 자동 생성
            chosenFriendList.length - 1 === 0 ? 
            chattingRoomName = `${chosenFriendList[0].nickname}` : 
            chattingRoomName = `${chosenFriendList[0].nickname} 외 ${chosenFriendList.length - 1}명과의 대화`
        }

        const sendBody ={
            name: chattingRoomName,
            userIdList: chosenFriendUserIdList,
        };

        const res = await postAxios(makeNewChattingRoomUrl, sendBody, {}, refreshAccessToken);
        setLeftBookState(`chat/${res.data.data.chatroomId}`);
        setChattingTriger(true);
        submitAbleAgain();
    };
    useEffect(() => {createChatClickHandlerSecondAct();}, [newChatSubmitClicked]);

    return(
        loading ? null :
        <div className={Style.wholeCover}>
            {/* 검색창 */}
            <form className={Style.flexBoxLeft} onSubmit={changeOutputFriendListbySearch}>
                <input 
                    className={Style.friendInput}
                    placeholder="친구 이름을 검색하세요."
                    onChange={friendSearchInputChangeHandler}
                    value={friendSearchInput}
                />
            </form>
            {/* 친구 리스트 */}
            <div className={Style.friendBox}>
                <div className={Style.friendList}>
                    {
                        chosenFriendList.length === 0 && outputFriendList.length === 0 ?
                        <p style={{width: "100%", textAlign: 'center'}}>친구가 없습니다..</p>
                        :
                        null
                    }
                    {
                        chosenFriendList.map((data, index) => (
                            <SingleFriend 
                                key={index}
                                data={data}
                                setChosenFriendList={setChosenFriendList}
                                chosenFriendList={chosenFriendList}
                                addStyle={{backgroundColor: "gray"}}
                            />
                        ))
                    }
                    {
                        outputFriendList.map((data, index) => (
                            <SingleFriend 
                                key={index}
                                data={data}
                                setChosenFriendList={setChosenFriendList}
                                chosenFriendList={chosenFriendList}
                                addStyle={null}
                            />
                        ))
                    }
                </div>
            </div>
            {/* 생성 버튼 */}
            <div className={Style.flexBoxRight}>
                <input 
                    className={Style.friendInput}
                    placeholder="채팅방의 이름을 설정하세요..(최대 10자)"
                    maxLength={10}
                    onChange={chattingRoomNameInputChangeHandler}
                    value={chattingRoomNameInput}
                />
                <button id="newChattingBtn" type="button" className={Style.submitBtn} onClick={createChatClickHandler}>생 성</button>
            </div>
        </div>
    );
};

export default LeftNewChat;