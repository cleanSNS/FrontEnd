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

const RenderRightFriend = ({followeeList, leftBookChangeHandler}) => {
    return(
        <div className={Style.friendList}>
            {
                followeeList.length === 0 ? 
                <p className={Style.noFollowee}>팔로우 중인 유저가 없습니다.</p>
                :
                followeeList.map((data, index) => (
                    <div className={Style.friendProfileCover} key={index}>
                        <Profile img={data.imgUrl} name={data.nickname} userId={data.userId} leftBookChangeHandler={leftBookChangeHandler}/>
                    </div>
                ))
            }
        </div>
    );
}

const RightFriend = ({leftBookChangeHandler, refreshAccessToken}) => {
    const [followeeList, setFolloweeList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [myProfileImage, setMyProfileImage] = useState("");
    const [myProfileName, setMyProfileName] = useState("");
    const [myId, setMyId] = useState("");

    //화면 렌더링 초기 설정 함수
    const rightFriendPreset = () => {
        axios.get(getFolloweeListUrl)//내가 팔로우 중인 유저 불러오기
        .then((res) => {
            setFolloweeList(res.data.data);
        })
        .catch((res) => {
            if(res.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("에러 발생");
                //window.location.href = '/main';
            }
        });

        axios.get(getfollowerListUrl)//나를 팔로우 중인 유저 불러오기
        .then((res) => {
            setFollowerList(res.data.data);
        })
        .catch((res) => {
            if(res.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("에러 발생");
                //window.location.href = '/main';
            }
        });

        axios.get(getcurrentProfileUrl)//내 정보 불러오기
        .then((res) => {
            setMyProfileName(res.data.data.nickname);
            setMyProfileImage(res.data.data.imgUrl);
        })
        .catch((res) => {
            if(res.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("에러 발생");
                //window.location.href = '/main';
            }
        });

        axios.get(getMyUserIdUrl)//내 id불러오기
        .then((res) => {
            setMyId(res.data.data.userId);
        })
        .catch((res) => {
            if(res.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("에러 발생");
                //window.location.href = '/main';
            }
        });
    };
    useEffect(rightFriendPreset, []);

    console.log(followeeList);

    return(
        <div className={Style.wholeCover}>
            <div className={Style.Cover}>
                <Profile img={myProfileImage} name={myProfileName} key={myId} leftBookChangeHandler={leftBookChangeHandler}/>
            </div>
            <RenderRightFriend followeeList={followeeList} leftBookChangeHandler={leftBookChangeHandler}/>
        </div>
    );
}

export default RightFriend;