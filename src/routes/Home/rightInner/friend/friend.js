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

const RenderRightFriend = ({freindList, leftBookChangeHandler}) => {
    return(
        <div className={Style.friendList}>
            {
                freindList.length === 0 ? 
                <p className={Style.noFollowee}>친구인 유저가 없습니다.</p>
                :
                freindList.map((data, index) => (
                    <div className={Style.friendProfileCover} key={index}>
                        <Profile img={data.imgUrl} name={data.nickname} userId={data.userId} leftBookChangeHandler={leftBookChangeHandler}/>
                    </div>
                ))
            }
        </div>
    );
}

const RightFriend = ({leftBookChangeHandler, refreshAccessToken}) => {
    const [freindList, setFreindList] = useState([]);
    const [myProfileImage, setMyProfileImage] = useState("");
    const [myProfileName, setMyProfileName] = useState("");
    const [myId, setMyId] = useState("");

    //화면 렌더링 초기 설정 함수
    const rightFriendPreset = () => {
        let followeeListtmp;
        axios.get(getFolloweeListUrl)//내가 팔로우 중인 유저 불러오기
        .then((res) => {
            const tmp = [...res.data.data];
            followeeListtmp = tmp;
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

        console.log(followeeListtmp);

        let followerListtmp;
        axios.get(getfollowerListUrl)//나를 팔로우 중인 유저 불러오기
        .then((res) => {
            const tmp = [...res.data.data];
            followerListtmp = tmp;
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

        console.log(followerListtmp);

        //follower와 follwee에 동시에 속한 값들은 친구로 저장
        const JSONFollowerList = followerListtmp.map(d => JSON.stringify(d));
        const JSONFolloweeList = followeeListtmp.map(d => JSON.stringify(d));
        const JSONFreindList = JSONFollowerList.filter(x => JSONFolloweeList.includes(x));
        setFreindList(JSONFreindList.map(d => JSON.parse(d)));


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

    return(
        <div className={Style.wholeCover}>
            <div className={Style.Cover}>
                <Profile img={myProfileImage} name={myProfileName} userId={myId} leftBookChangeHandler={leftBookChangeHandler}/>
            </div>
            <RenderRightFriend freindList={freindList} leftBookChangeHandler={leftBookChangeHandler}/>
        </div>
    );
}

export default RightFriend;