import Style from './friend.module.css';
import Profile from '../../root/profile';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    getFolloweeListUrl,
    getfollowerListUrl,
    getcurrentProfileUrl,
    getMyUserIdUrl,
} from '../../../../apiUrl';

const RenderRightFriend = ({friendList, leftBookChangeHandler}) => {
    return(
        <div className={Style.friendList}>
            {
                friendList.length === 0 ? 
                <p className={Style.noFollowee}>친구인 유저가 없습니다.</p>
                :
                friendList.map((data, index) => (
                    <div className={Style.friendProfileCover} key={index}>
                        <Profile img={data.imgUrl} name={data.nickname} userId={data.userId} leftBookChangeHandler={leftBookChangeHandler}/>
                    </div>
                ))
            }
        </div>
    );
}

const RightFriend = ({userId, leftBookChangeHandler, refreshAccessToken, chatAndFriendReloadTriger, setChatAndFriendReloadTriger, userPageAndFriendReloadTriger, setUserPageAndFriendReloadTriger}) => {
    const [followeeList, setFolloweeList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [myProfileImage, setMyProfileImage] = useState("");
    const [myProfileName, setMyProfileName] = useState("");

    const rightFriendAndUserProfileChangeHandler = () => {//오른쪽 화면이 친구리스트인데 사용자가 프로필을 수정하는 경우, 사용자의 프로필을 다시 불러와서 갱신하는 함수
        if(!chatAndFriendReloadTriger) return;
        axios.get(getcurrentProfileUrl)//내 정보 불러오기
        .then((res) => {
            setMyProfileName(res.data.data.nickname);
            setMyProfileImage(res.data.data.imgUrl);
            setChatAndFriendReloadTriger(false);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){//access token이 만료된 경우이다.
                refreshAccessToken();
                rightFriendAndUserProfileChangeHandler();
            }
            else{
                console.log(res);
                alert("내 프로필을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(rightFriendAndUserProfileChangeHandler, [chatAndFriendReloadTriger]);

    //화면 렌더링 초기 설정 함수
    const rightFriendPreset = () => {
        axios.get(getFolloweeListUrl)//내가 팔로우 중인 유저 불러오기
        .then((res) => {
            const tmp = [...res.data.data];
            setFolloweeList(tmp);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){//access token이 만료된 경우이다.
                refreshAccessToken();
                rightFriendPreset();
            }
            else{
                console.log(res);
                alert("팔로우 중인 유저를 불러오지 못했습니다.");
            }
        });

        axios.get(getfollowerListUrl)//나를 팔로우 중인 유저 불러오기
        .then((res) => {
            const tmp = [...res.data.data];
            setFollowerList(tmp);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){//access token이 만료된 경우이다.
                refreshAccessToken();
                rightFriendPreset();
            }
            else{
                console.log(res);
                alert("나를 팔로우 중인 유저를 불러오지 못했습니다.");
            }
        });

        axios.get(getcurrentProfileUrl)//내 정보 불러오기
        .then((res) => {
            setMyProfileName(res.data.data.nickname);
            setMyProfileImage(res.data.data.imgUrl);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){//access token이 만료된 경우이다.
                refreshAccessToken();
                rightFriendPreset();
            }
            else{
                console.log(res);
                alert("내 정보를 불러오지 못했습니다.");
            }
        });
    };
    useEffect(rightFriendPreset, []);

    useEffect(() => {//유저의 page에서 팔로우 클릭 시 친구 정보를 다시 불러온다.
        if(!userPageAndFriendReloadTriger) return;//false인 경우 실행 X
        rightFriendPreset();
        setUserPageAndFriendReloadTriger(false);
    }, [userPageAndFriendReloadTriger]);

    const friendListSet = () => {
        //follower와 follwee에 동시에 속한 값들은 친구로 저장
        const JSONFollowerList = followerList.map(d => JSON.stringify(d));
        const JSONFolloweeList = followeeList.map(d => JSON.stringify(d));
        const JSONFriendList = JSONFollowerList.filter(x => JSONFolloweeList.includes(x));
        setFriendList(JSONFriendList.map(d => JSON.parse(d)));
    };
    useEffect(friendListSet, [followerList, followeeList]);

    return(
        <div className={Style.wholeCover}>
            <div className={Style.Cover}>
                <Profile img={myProfileImage} name={myProfileName} userId={userId} leftBookChangeHandler={leftBookChangeHandler}/>
            </div>
            <RenderRightFriend friendList={friendList} leftBookChangeHandler={leftBookChangeHandler}/>
        </div>
    );
}

export default RightFriend;