import Style from './newChat.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    getFolloweeListUrl,
    getfollowerListUrl
} from '../../../../apiUrl';

const SingleFriend = ({data, setChosenFriendList, chosenFriendList}) => {
    //유저가 선택되면 outputFriendList가 변경된다. 이를 처리하는 함수
    const addFriend = () => {
        const tmp = [...chosenFriendList];//지금까지 선택된 친구들
        tmp.push(data);//클릭된 유저를 집어넣는다.
        setChosenFriendList(tmp);//선택된 유저를 변경한다.
    };

    return(
        <div className={Style.singleFriend} onClick={addFriend}>
            <div className={Style.flexBox}>
                <img src={data.imgUrl} className={Style.friendImg} />
            </div>
            <div className={Style.flexBox}>
                <p className={Style.friendNickname}>{data.nickname}</p>
            </div>
        </div>
    );
};

const LeftNewChat = ({refreshAccessToken}) => {
    const [friendSearchInput, setFriendSearchInput] = useState("");//친구 검색용
    const [outputFriendList, setOutputFriendList] = useState([]);//실제로 출력할 친구 리스트
    const [wholeFriendList, setWholeFriendList] = useState([]);//받아온 친구 리스트
    const [chosenFriendList, setChosenFriendList] = useState([]);//선택된 친구 리스트
    const [followerList, setFollowerList] = useState([
        {
            "userId": 1,
            "nickname": "홍길동",
            "imgUrl": null
        },
        {
            "userId": 2,
            "nickname": "김철수",
            "imgUrl": null
        },
        {
            "userId": 3,
            "nickname": "이영희",
            "imgUrl": null
        },
        {
            "userId": 4,
            "nickname": "박민철",
            "imgUrl": null
        },
    ]);//친구를 받기 위해 followerList를 받아온다.
    const [followeeList, setFolloweeList] = useState([
        {
            "userId": 2,
            "nickname": "김철수",
            "imgUrl": null
        },
        {
            "userId": 3,
            "nickname": "이영희",
            "imgUrl": null
        },
        {
            "userId": 4,
            "nickname": "박민철",
            "imgUrl": null
        },
    ]);//친구를 받기 위해 followeeList를 받아온다.

    const friendSearchInputChangeHandler = (event) => {
        setFriendSearchInput(event.target.value);
    };

    /*
    과정
    1. 초기 상태에 Follower, Followee를 불러온다.
    2. Follower, Followee를 이용해서 friendList를 생성한다.
    3. friendList를 아래 조건들을 맞춰 진행한다.

    조건1) 유저가 검색을 한 경우
        검색한 글을 포함하는 친구들만 outputFriendList에 넣는다.
    조건2) 유저를 추가한 경우
        유저를 클릭할 때마다 해당 유저를 chosenFriendList에 넣고 outputFriendList의 상단에 고정한다.
        => 해결법 : outputFriendList = chosenFriendList + 조건1에 맞는 friendList(에서 chosenFriendList에 있는 경우 제거)
    => 조건1,2 변경시마다 outPutFriendList를 업데이트한다.

    4. outputFriendList를 출력한다.
    */

    //팔로워와 팔로잉을 불러오는 함수
    const presetFollowerAndFollowee = () => {
        axios.get(getFolloweeListUrl)
        .then((res) => {
            const tmp = [...res.data.data];
            setFolloweeList(tmp);//팔로잉 저장
            axios.get(getfollowerListUrl)
            .then((res) => {
                const tmp2 = [...res.data.data];
                setFollowerList(tmp2);//팔로워 저장
            })
            .catch((res) => {
                if(res.status === 401){
                    refreshAccessToken();
                }
                else{
                    alert("팔로워을 불러오지 못했습니다.");
                }
            });
        })
        .catch((res) =>{
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                alert("팔로잉을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetFollowerAndFollowee, []);//초기 상황에만 진행

    //팔로워와 팔로잉을 바탕으로 친구 리스트를 파악하는 함수
    const presetFriendList = () => {
        //follower와 follwee에 동시에 속한 값들은 친구로 저장
        const JSONFollowerList = followerList.map(d => JSON.stringify(d));
        const JSONFolloweeList = followeeList.map(d => JSON.stringify(d));
        const JSONFriendList = JSONFollowerList.filter(x => JSONFolloweeList.includes(x));
        setWholeFriendList(JSONFriendList.map(d => JSON.parse(d)));
    };
    useEffect(presetFriendList, [followerList, followeeList]);

    //유저를 검색하면 outputFriendList가 변경된다. 이를 처리하는 함수
    const changeOutputFriendListbySearch = (event) => {
        event.preventDefault();
        //whole친구 리스트를 바탕으로 조건에 맞는것만 outputList에 반영한다.
        const tmp = wholeFriendList.filter(d => d.nickname.includes(friendSearchInput))//모든 친구중 이름에 검색사항이 포함된 친구만 받는다.
        setOutputFriendList(tmp);//검색된 유저들만 리스트에 올린다.
    };

    //선택된 유저 리스트가 변경되면 output친구 리스트를 변경해야한다.
    const changeOutputFriendListbyClick = () => {
        const JSONOutputFriendList = outputFriendList.map(d => JSON.stringify(d));
        const JSONChosenFriendList = chosenFriendList.map(d => JSON.stringify(d));
        const leftOverList = JSONOutputFriendList.filter(x => !JSONChosenFriendList.includes(x));//출력값중에서 친구리스트에 없는 친구들이 남은 애들이다.
        const preList = [...chosenFriendList];
        const next = preList.concat(leftOverList);
        setOutputFriendList(next);
    };
    useEffect(changeOutputFriendListbyClick, [chosenFriendList]);

    return(
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
                        outputFriendList.map((data,index) => (
                            <SingleFriend key={index} data={data} setChosenFriendList={setChosenFriendList} chosenFriendList={chosenFriendList}/>
                        ))
                    }
                </div>
            </div>
            {/* 생성 버튼 */}
            <div className={Style.flexBoxRight}>
                <button className={Style.submitBtn}>생 성</button>
            </div>
        </div>
    );
};

export default LeftNewChat;